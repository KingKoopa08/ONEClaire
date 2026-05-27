import { z } from 'zod';
import type { AiKnowledgeLayer, KnowledgeArticle } from '../shared/types.js';
import { buildDeterministicLayer } from './enrichment.js';

const layerSchema = z.object({
  sourceArticleTitle: z.string(),
  sourceArticleNumber: z.string().optional(),
  status: z.enum(['draft','needs_review','approved','published']),
  customerIntent: z.string(),
  customerPhrases: z.array(z.string()),
  symptoms: z.array(z.string()),
  commonErrorMessages: z.array(z.string()),
  claireSearchTerms: z.array(z.string()),
  customerSafeSummary: z.string(),
  discoveryQuestions: z.array(z.string()),
  claireCanTry: z.array(z.string()),
  doNotSayOrAttempt: z.array(z.string()),
  escalationTriggers: z.array(z.string()),
  routingRecommendation: z.string(),
  requiredSalesforceFields: z.array(z.string()),
  caseSummaryTemplate: z.string(),
  confidenceScore: z.number().min(0).max(1),
  reviewerQuestions: z.array(z.string())
});

export async function generateLayer(article: KnowledgeArticle): Promise<{ layer: AiKnowledgeLayer; mode: 'local' | 'llm' }> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
  if (!apiKey) return { layer: buildDeterministicLayer(article), mode: 'local' };

  const model = process.env.OPENAI_MODEL || process.env.LLM_MODEL || 'gpt-4o-mini';
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const system = 'You create AI Knowledge Enrichment Layer records for a customer-facing AI support agent named Claire. Convert technician-written KBs into customer-safe language. Return strict JSON only.';
  const user = `Create an AI Knowledge Enrichment Layer for this Salesforce Knowledge article. Do not expose internal admin/backend instructions as customer-facing wording. Include safe discovery questions, safe troubleshooting, escalation triggers, routing, and reviewer questions.\n\nArticle number: ${article.articleNumber ?? ''}\nTitle: ${article.title}\nProduct: ${article.product ?? ''}\nBody:\n${article.body.slice(0, 18000)}`;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  });
  if (!response.ok) throw new Error(`LLM ${response.status}: ${await response.text()}`);
  const data: any = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('LLM returned no content.');
  const parsed = layerSchema.parse(JSON.parse(content));
  return { layer: parsed, mode: 'llm' };
}
