import type { AiKnowledgeLayer, KnowledgeArticle } from '../shared/types.js';

const STOP_WORDS = new Set([
  'the','and','for','with','that','this','from','into','when','then','than','are','you','your','will','can','should','must','have','has','not','all','any','was','were','our','their','customer','customers','article','issue','step','steps'
]);

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function keywords(text: string, count = 8): string[] {
  const tally = new Map<string, number>();
  for (const word of text.toLowerCase().match(/[a-z][a-z0-9-]{2,}/g) ?? []) {
    if (STOP_WORDS.has(word)) continue;
    tally.set(word, (tally.get(word) ?? 0) + 1);
  }
  return [...tally.entries()].sort((a,b) => b[1] - a[1]).slice(0, count).map(([w]) => w);
}

function detectErrors(text: string): string[] {
  const results = new Set<string>();
  const patterns = [
    /error\s*(?:code)?[:#]?\s*[A-Z0-9_-]+/gi,
    /[A-Z]{2,}[-_][0-9]{2,}/g,
    /(?:failed|failure|denied|locked|timeout|timed out|invalid|unavailable|not found|greyed out|grayed out)/gi
  ];
  for (const pattern of patterns) {
    for (const match of text.match(pattern) ?? []) results.add(match.trim());
  }
  return [...results].slice(0, 8);
}

function lineItems(text: string, fallback: string[]): string[] {
  const matches = text
    .split('\n')
    .map(l => l.replace(/^[-*\d.)\s]+/, '').trim())
    .filter(l => l.length > 12 && l.length < 140)
    .slice(0, 6);
  return matches.length ? matches : fallback;
}

export function buildDeterministicLayer(article: KnowledgeArticle): AiKnowledgeLayer {
  const keys = keywords(`${article.title} ${article.body}`, 10);
  const top = keys.slice(0, 4);
  const articleSentences = sentences(article.body);
  const errors = detectErrors(article.body);
  const topic = top.length ? top.join(' / ') : article.title;
  const intentSlug = (article.title || topic)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 60) || 'customer_support_issue';

  return {
    sourceArticleTitle: article.title,
    sourceArticleNumber: article.articleNumber,
    status: 'draft',
    customerIntent: intentSlug,
    customerPhrases: [
      `I need help with ${top[0] ?? 'this issue'}`,
      `${article.title} is not working`,
      `I am getting stuck when trying to use ${top[1] ?? 'the feature'}`,
      `Something is wrong with ${top[2] ?? 'my account'}`,
      `Can someone help me fix ${top[3] ?? 'this problem'}?`
    ],
    symptoms: lineItems(article.body, [
      `Customer reports an issue related to ${topic}.`,
      'Customer cannot complete the expected workflow.',
      'Customer may see an error, blocked step, or unexpected behavior.'
    ]).slice(0, 5),
    commonErrorMessages: errors.length ? errors : ['No explicit error message found in the source article. Capture exact customer wording.'],
    claireSearchTerms: [...new Set([article.title, ...keys, ...(article.product ? [article.product] : [])])].slice(0, 12),
    customerSafeSummary: articleSentences[0]
      ? `This article appears to help with ${articleSentences[0].replace(/\.$/, '').toLowerCase()}. Claire should translate internal steps into plain customer language and avoid exposing backend or admin-only details.`
      : `This article helps with ${article.title}. Claire should use plain customer language and collect enough detail to resolve or route the issue.`,
    discoveryQuestions: [
      'Can you describe what you were trying to do when the problem happened?',
      'What exact message or error do you see, if any?',
      'Did this start today, or has it happened before?',
      'Is this affecting only you or multiple users?',
      'What product, account, location, or record were you working in?'
    ],
    claireCanTry: [
      'Confirm the customer identity and affected product or workflow.',
      'Collect the exact error message and the step where the issue occurs.',
      'Walk through any customer-safe checks from the source article.',
      'Summarize attempted steps before escalation.'
    ],
    doNotSayOrAttempt: [
      'Do not read internal admin, backend, database, API, or log instructions directly to the customer.',
      'Do not ask the customer to perform technician-only steps.',
      'Do not promise resolution if the article requires internal access or engineering review.'
    ],
    escalationTriggers: [
      'Customer asks for a human or expresses low confidence in AI support.',
      'The issue requires admin-only, backend, security, billing, data correction, or engineering action.',
      'Multiple users are impacted or a production outage is suspected.',
      'Customer cannot proceed after approved troubleshooting steps.'
    ],
    routingRecommendation: article.product ? `${article.product} support queue` : 'Route based on product, feature, and issue category captured from the customer.',
    requiredSalesforceFields: ['ContactId', 'AccountId', 'Product/Feature', 'Issue Category', 'Error Message', 'Steps Attempted', 'Escalation Reason'],
    caseSummaryTemplate: 'Customer reported [plain-language issue] while attempting [workflow]. Error/message: [exact text]. Scope: [single user/multiple users]. Steps attempted by Claire: [steps]. Recommended route: [queue/team].',
    confidenceScore: article.body.length > 600 ? 0.72 : 0.55,
    reviewerQuestions: [
      'Which queue should own escalations for this issue?',
      'Which troubleshooting steps are approved for Claire to perform directly with customers?',
      'Are there security, billing, compliance, or data-loss risks that require stricter escalation?'
    ]
  };
}

export function layerToMarkdown(layer: AiKnowledgeLayer): string {
  const list = (items: string[]) => items.map(item => `- ${item}`).join('\n');
  return `# AI Knowledge Enrichment Layer: ${layer.sourceArticleTitle}\n\n` +
    `**Status:** ${layer.status}\n` +
    `**Intent:** ${layer.customerIntent}\n` +
    `**Confidence:** ${Math.round(layer.confidenceScore * 100)}%\n\n` +
    `## Customer phrases\n${list(layer.customerPhrases)}\n\n` +
    `## Symptoms\n${list(layer.symptoms)}\n\n` +
    `## Common error messages\n${list(layer.commonErrorMessages)}\n\n` +
    `## Claire search terms\n${list(layer.claireSearchTerms)}\n\n` +
    `## Customer-safe summary\n${layer.customerSafeSummary}\n\n` +
    `## Discovery questions\n${list(layer.discoveryQuestions)}\n\n` +
    `## Claire can try\n${list(layer.claireCanTry)}\n\n` +
    `## Do not say or attempt\n${list(layer.doNotSayOrAttempt)}\n\n` +
    `## Escalation triggers\n${list(layer.escalationTriggers)}\n\n` +
    `## Routing recommendation\n${layer.routingRecommendation}\n\n` +
    `## Required Salesforce fields\n${list(layer.requiredSalesforceFields)}\n\n` +
    `## Case summary template\n${layer.caseSummaryTemplate}\n\n` +
    `## Reviewer questions\n${list(layer.reviewerQuestions)}\n`;
}
