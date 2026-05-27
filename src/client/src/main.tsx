import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle2, Clipboard, CloudUpload, FileText, Loader2, Search, Sparkles } from 'lucide-react';
import type { AiKnowledgeLayer, KnowledgeArticle } from '../../shared/types';
import './styles.css';

type Health = { ok: boolean; salesforceConfigured: boolean; aiConfigured: boolean };

type Tab = 'markdown' | 'json';

const emptyArticle: KnowledgeArticle = {
  source: 'manual',
  title: '',
  body: '',
  articleNumber: '',
  product: ''
};

async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function Pill({ children, ok }: { children: React.ReactNode; ok?: boolean }) {
  return <span className={ok ? 'pill ok' : 'pill'}>{children}</span>;
}

function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [lookup, setLookup] = useState('');
  const [article, setArticle] = useState<KnowledgeArticle>(emptyArticle);
  const [layer, setLayer] = useState<AiKnowledgeLayer | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [mode, setMode] = useState<'local' | 'llm' | ''>('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [tab, setTab] = useState<Tab>('markdown');

  useEffect(() => {
    api<{ ok: boolean; salesforceConfigured: boolean; aiConfigured: boolean }>('/api/health')
      .then(setHealth)
      .catch(() => setHealth({ ok: false, salesforceConfigured: false, aiConfigured: false }));
  }, []);

  const jsonOutput = useMemo(() => layer ? JSON.stringify(layer, null, 2) : '', [layer]);

  async function fetchKb() {
    setError(''); setBusy('fetch');
    try {
      const data = await api<{ article: KnowledgeArticle }>('/api/kb/fetch', { input: lookup });
      setArticle(data.article);
      setLayer(null); setMarkdown(''); setMode('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not fetch KB');
    } finally { setBusy(''); }
  }

  async function generate() {
    setError(''); setBusy('generate');
    try {
      const data = await api<{ layer: AiKnowledgeLayer; markdown: string; mode: 'local' | 'llm' }>('/api/enrich', { article });
      setLayer(data.layer); setMarkdown(data.markdown); setMode(data.mode); setTab('markdown');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not generate enrichment');
    } finally { setBusy(''); }
  }

  async function publish() {
    if (!layer) return;
    setError(''); setBusy('publish');
    try {
      const data = await api<{ result: unknown }>('/api/publish', { layer: { ...layer, status: 'published' } });
      setCopied(`Publish result: ${JSON.stringify(data.result)}`);
      setTimeout(() => setCopied(''), 5000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not publish');
    } finally { setBusy(''); }
  }

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(`${label} copied`);
    setTimeout(() => setCopied(''), 2000);
  }

  return <main>
    <header className="hero">
      <div className="brand">ONE Claire</div>
      <div>
        <h1>AI Knowledge Enrichment Layer</h1>
        <p>Turn technician-written Salesforce Knowledge into customer-language guidance Claire can safely search, use, and escalate from.</p>
      </div>
      <div className="status-row">
        <Pill ok={health?.ok}>App {health?.ok ? 'ready' : 'checking'}</Pill>
        <Pill ok={health?.salesforceConfigured}>Salesforce {health?.salesforceConfigured ? 'connected' : 'mock mode'}</Pill>
        <Pill ok={health?.aiConfigured}>AI {health?.aiConfigured ? 'configured' : 'local generator'}</Pill>
      </div>
    </header>

    {error && <section className="alert">{error}</section>}
    {copied && <section className="toast"><CheckCircle2 size={18}/>{copied}</section>}

    <section className="grid two">
      <div className="card">
        <div className="card-title"><Search size={20}/> Load Salesforce KB</div>
        <p className="muted">Paste a Salesforce Knowledge URL or article number. Without credentials, this returns realistic mock content so the workflow can be tested now.</p>
        <div className="lookup-row">
          <input value={lookup} onChange={e => setLookup(e.target.value)} placeholder="KB-001234 or Salesforce Knowledge URL" />
          <button onClick={fetchKb} disabled={!lookup || busy === 'fetch'}>{busy === 'fetch' ? <Loader2 className="spin"/> : <Search/>} Fetch</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><Sparkles size={20}/> Generate Enrichment</div>
        <p className="muted">Uses an LLM if configured. Otherwise uses the built-in local generator for demos, testing, and offline drafting.</p>
        <button className="wide" onClick={generate} disabled={!article.title || article.body.length < 20 || busy === 'generate'}>{busy === 'generate' ? <Loader2 className="spin"/> : <Sparkles/>} Generate AI Layer</button>
      </div>
    </section>

    <section className="grid two workspace">
      <div className="card editor-card">
        <div className="card-title"><FileText size={20}/> Source Knowledge Article</div>
        <Field label="Article number"><input value={article.articleNumber ?? ''} onChange={e => setArticle({ ...article, articleNumber: e.target.value, source: 'manual' })}/></Field>
        <Field label="Title"><input value={article.title} onChange={e => setArticle({ ...article, title: e.target.value, source: 'manual' })}/></Field>
        <Field label="Product / feature"><input value={article.product ?? ''} onChange={e => setArticle({ ...article, product: e.target.value, source: 'manual' })}/></Field>
        <Field label="KB body"><textarea value={article.body} onChange={e => setArticle({ ...article, body: e.target.value, source: 'manual' })} placeholder="Paste the technician KB content here if you do not have Salesforce credentials yet."/></Field>
      </div>

      <div className="card editor-card">
        <div className="card-title"><CloudUpload size={20}/> AI Layer Output {mode && <span className="mode">{mode === 'llm' ? 'LLM generated' : 'local draft'}</span>}</div>
        {!layer ? <div className="empty">Generate an AI layer to see the copy/paste output here.</div> : <>
          <div className="tab-row">
            <button className={tab === 'markdown' ? 'active' : ''} onClick={() => setTab('markdown')}>Markdown</button>
            <button className={tab === 'json' ? 'active' : ''} onClick={() => setTab('json')}>JSON</button>
            <button onClick={() => copy(tab === 'markdown' ? markdown : jsonOutput, tab.toUpperCase())}><Clipboard size={16}/> Copy</button>
            <button onClick={publish} disabled={busy === 'publish'}>{busy === 'publish' ? <Loader2 className="spin"/> : <CloudUpload size={16}/>} Publish</button>
          </div>
          <textarea className="output" value={tab === 'markdown' ? markdown : jsonOutput} onChange={e => tab === 'markdown' ? setMarkdown(e.target.value) : null}/>
        </>}
      </div>
    </section>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
