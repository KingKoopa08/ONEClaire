# Architecture

## Current MVP Architecture

```text
Browser UI
   ↓
Express API
   ↓
Knowledge loader
   ↓
Enrichment generator
   ↓
Markdown / JSON / Salesforce publish
```

## Components

### Frontend

React + Vite web app.

Responsibilities:

- Load KB input
- Display source article
- Trigger enrichment generation
- Display Markdown and JSON output
- Copy output
- Trigger publish

### Backend API

Express server.

Responsibilities:

- Health check
- Salesforce/mock KB fetch
- AI/local enrichment generation
- Markdown conversion
- Salesforce/mock publish
- Static production UI serving

### Salesforce Integration

Optional in MVP.

When configured, ONE Claire can fetch Salesforce Knowledge articles and publish enrichment records to a Salesforce custom object.

Required env vars:

```bash
SALESFORCE_INSTANCE_URL
SALESFORCE_ACCESS_TOKEN
SALESFORCE_API_VERSION
SALESFORCE_ENRICHMENT_OBJECT
```

### LLM Integration

Optional in MVP.

When configured, ONE Claire uses an OpenAI-compatible chat completions endpoint.

Required env vars:

```bash
OPENAI_API_KEY
OPENAI_BASE_URL
OPENAI_MODEL
```

Without an LLM key, ONE Claire uses a local deterministic generator.

## Production Architecture Direction

Recommended production setup:

```text
Authenticated internal users
   ↓
ONE Claire web app
   ↓
Backend API
   ↓
Salesforce Knowledge API
   ↓
LLM enrichment generation
   ↓
Human review workflow
   ↓
Salesforce AI_Knowledge_Enrichment__c records
   ↓
Claire / Atonom consumption
```

## Data Flow

1. User provides article URL or article number.
2. Backend retrieves Knowledge article from Salesforce.
3. Backend sends source content to enrichment generator.
4. Generator returns structured enrichment JSON.
5. Backend converts JSON to Markdown for copy/paste.
6. User reviews and edits.
7. User publishes to Salesforce custom object or exports.
8. Claire/Atonom consumes approved records.

## Security Notes

- Do not commit `.env` files.
- Do not store Salesforce tokens in client-side code.
- Do not expose the utility publicly without authentication.
- Redact secrets from logs.
- Keep AI output in draft until reviewed.
