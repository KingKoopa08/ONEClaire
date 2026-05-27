import type { AiKnowledgeLayer, KnowledgeArticle } from '../shared/types.js';

const API_VERSION = process.env.SALESFORCE_API_VERSION || 'v61.0';

function salesforceConfig() {
  return {
    instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
    accessToken: process.env.SALESFORCE_ACCESS_TOKEN,
    enrichmentObject: process.env.SALESFORCE_ENRICHMENT_OBJECT || 'AI_Knowledge_Enrichment__c'
  };
}

export function hasSalesforceConfig(): boolean {
  const cfg = salesforceConfig();
  return Boolean(cfg.instanceUrl && cfg.accessToken);
}

function articleNumberFromInput(input: string): string {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/[?&](?:articleNumber|ArticleNumber|ka)=([^&]+)/);
  if (urlMatch) return decodeURIComponent(urlMatch[1]);
  const pathMatch = trimmed.match(/(?:knowledge|articles?|ka|KB)[\w/-]*[/=:]([A-Za-z0-9_-]{3,})/i);
  if (pathMatch) return pathMatch[1];
  return trimmed;
}

async function sfFetch(path: string, init?: RequestInit) {
  const cfg = salesforceConfig();
  if (!cfg.instanceUrl || !cfg.accessToken) throw new Error('Salesforce is not configured. Set SALESFORCE_INSTANCE_URL and SALESFORCE_ACCESS_TOKEN.');
  const response = await fetch(`${cfg.instanceUrl}/services/data/${API_VERSION}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cfg.accessToken}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Salesforce ${response.status}: ${text}`);
  }
  return response.json() as Promise<any>;
}

export async function fetchKnowledgeArticle(input: string): Promise<KnowledgeArticle> {
  const articleNumber = articleNumberFromInput(input);
  if (!hasSalesforceConfig()) {
    return {
      source: 'mock',
      articleNumber,
      url: input.startsWith('http') ? input : undefined,
      title: `Mock Salesforce Knowledge Article ${articleNumber || 'Manual'}`,
      product: 'Sample Product',
      lastModified: new Date().toISOString(),
      body: `Troubleshooting article for ${articleNumber || 'a customer issue'}. Verify user entitlement and account status. Check whether the customer sees an invalid login, access denied, timeout, or workflow failure message. Confirm required fields are populated. If backend validation fails or multiple users are affected, escalate to the owning product support queue with logs and exact error text.`
    };
  }

  const soql = encodeURIComponent(`SELECT Id, ArticleNumber, Title, Summary, LastPublishedDate FROM Knowledge__kav WHERE ArticleNumber = '${articleNumber.replace(/'/g, "\\'")}' AND PublishStatus = 'Online' LIMIT 1`);
  const query = await sfFetch(`/query?q=${soql}`);
  const record = query.records?.[0];
  if (!record) throw new Error(`No online Salesforce Knowledge article found for ${articleNumber}.`);

  // Retrieve full record dynamically. Body field names differ by org, so include the fields returned by Salesforce.
  const full = await sfFetch(`/sobjects/Knowledge__kav/${record.Id}`);
  const bodyField = ['Article_Body__c', 'Answer__c', 'Body__c', 'Content__c', 'Details__c'].find(field => typeof full[field] === 'string' && full[field].trim());
  const body = bodyField ? full[bodyField] : [full.Summary, full.Title].filter(Boolean).join('\n\n');

  return {
    source: 'salesforce',
    articleNumber: full.ArticleNumber || record.ArticleNumber,
    title: full.Title || record.Title,
    body,
    lastModified: full.LastPublishedDate || record.LastPublishedDate,
    url: input.startsWith('http') ? input : undefined
  };
}

export async function publishEnrichment(layer: AiKnowledgeLayer) {
  const cfg = salesforceConfig();
  if (!hasSalesforceConfig()) {
    return {
      mode: 'mock',
      id: `mock-${Date.now()}`,
      message: 'Salesforce credentials are not configured, so this was not published. The payload is valid for copy/export.'
    };
  }
  const payload: Record<string, unknown> = {
    Name: layer.sourceArticleTitle.slice(0, 80),
    Source_Article_Number__c: layer.sourceArticleNumber,
    Status__c: layer.status,
    Customer_Intent__c: layer.customerIntent,
    Customer_Phrases__c: layer.customerPhrases.join('\n'),
    Symptoms__c: layer.symptoms.join('\n'),
    Error_Messages__c: layer.commonErrorMessages.join('\n'),
    Claire_Search_Terms__c: layer.claireSearchTerms.join('\n'),
    Customer_Safe_Summary__c: layer.customerSafeSummary,
    Discovery_Questions__c: layer.discoveryQuestions.join('\n'),
    Claire_Can_Try__c: layer.claireCanTry.join('\n'),
    Do_Not_Say_Or_Attempt__c: layer.doNotSayOrAttempt.join('\n'),
    Escalation_Triggers__c: layer.escalationTriggers.join('\n'),
    Routing_Recommendation__c: layer.routingRecommendation,
    Required_Salesforce_Fields__c: layer.requiredSalesforceFields.join('\n'),
    Case_Summary_Template__c: layer.caseSummaryTemplate,
    Confidence_Score__c: layer.confidenceScore,
    Reviewer_Questions__c: layer.reviewerQuestions.join('\n')
  };
  return sfFetch(`/sobjects/${cfg.enrichmentObject}`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
