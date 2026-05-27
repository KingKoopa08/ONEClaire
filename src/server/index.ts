import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { fetchKnowledgeArticle, hasSalesforceConfig, publishEnrichment } from './salesforce.js';
import { generateLayer } from './ai.js';
import { layerToMarkdown } from './enrichment.js';
import type { KnowledgeArticle } from '../shared/types.js';

const app = express();
const port = Number(process.env.PORT || 8787);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = process.env.NODE_ENV === 'production'
  ? path.resolve(process.cwd(), 'dist/client')
  : path.resolve(__dirname, '../client');

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, salesforceConfigured: hasSalesforceConfig(), aiConfigured: Boolean(process.env.OPENAI_API_KEY || process.env.LLM_API_KEY) });
});

app.post('/api/kb/fetch', async (req, res) => {
  try {
    const { input } = z.object({ input: z.string().min(1) }).parse(req.body);
    const article = await fetchKnowledgeArticle(input);
    res.json({ article });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/enrich', async (req, res) => {
  try {
    const article = z.object({
      source: z.enum(['manual','salesforce','mock']).default('manual'),
      articleNumber: z.string().optional(),
      url: z.string().optional(),
      title: z.string().min(1),
      body: z.string().min(20),
      product: z.string().optional(),
      lastModified: z.string().optional()
    }).parse(req.body.article) satisfies KnowledgeArticle;
    const { layer, mode } = await generateLayer(article);
    res.json({ layer, markdown: layerToMarkdown(layer), mode });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/publish', async (req, res) => {
  try {
    const result = await publishEnrichment(req.body.layer);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.use(express.static(clientDir));
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`ONE Claire listening on http://localhost:${port}`);
});
