# ONE Claire

ONE Claire is a web utility for creating an **AI Knowledge Enrichment Layer** on top of Salesforce Knowledge articles.

It is designed for the Claire AI support workflow:

- Salesforce Knowledge remains the source of truth.
- ONE Claire creates a customer-language layer linked to the KB.
- Claire uses the layer for customer phrasing, intent matching, safe troubleshooting, routing, and case summaries.
- Internal technician instructions are not read directly to customers.

## Current MVP

Works today without Salesforce or AI keys:

- Manual KB paste mode
- Mock Salesforce KB fetch mode
- Local deterministic AI-layer draft generator
- Markdown and JSON copy/paste output
- Mock publish response
- Dockerized web app

When credentials are available, set env vars to enable:

- Salesforce Knowledge fetch
- Salesforce custom object publish
- OpenAI-compatible LLM generation

## Quick start

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

API runs on:

```text
http://localhost:8787
```

## Docker

```bash
cp .env.example .env
# edit .env when credentials are available

docker compose up --build
```

Open:

```text
http://localhost:8787
```

## Environment variables

```bash
PORT=8787

# Optional Salesforce connection. Without these, mock mode is used.
SALESFORCE_INSTANCE_URL=https://your-domain.my.salesforce.com
SALESFORCE_ACCESS_TOKEN=replace-me
SALESFORCE_API_VERSION=v61.0
SALESFORCE_ENRICHMENT_OBJECT=AI_Knowledge_Enrichment__c

# Optional OpenAI-compatible LLM. Without this, local generation is used.
OPENAI_API_KEY=replace-me
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

## Recommended Salesforce object

Preferred object name:

```text
AI_Knowledge_Enrichment__c
```

Suggested fields:

- `Source_Article_Number__c`
- `Status__c`
- `Customer_Intent__c`
- `Customer_Phrases__c`
- `Symptoms__c`
- `Error_Messages__c`
- `Claire_Search_Terms__c`
- `Customer_Safe_Summary__c`
- `Discovery_Questions__c`
- `Claire_Can_Try__c`
- `Do_Not_Say_Or_Attempt__c`
- `Escalation_Triggers__c`
- `Routing_Recommendation__c`
- `Required_Salesforce_Fields__c`
- `Case_Summary_Template__c`
- `Confidence_Score__c`
- `Reviewer_Questions__c`

## Workflow

1. Paste a Salesforce KB URL, article number, or manual article text.
2. ONE Claire pulls or accepts the source article.
3. Generate the AI Knowledge Enrichment Layer.
4. Review and edit output.
5. Copy Markdown/JSON or publish to Salesforce when credentials and object are ready.

## Tests

```bash
npm test
npm run build
```
