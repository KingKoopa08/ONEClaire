# ONE Claire Utility Specification

## Objective

Build a web-based utility that helps teams create AI Knowledge Enrichment records from Salesforce Knowledge articles.

## Users

- Support Ops
- Support SMEs
- Product Managers
- Engineering reviewers
- Salesforce admins
- Claire/Atonom implementation team

## MVP Features

### Knowledge Input

- Salesforce KB URL input
- Article number input
- Manual article paste
- Mock fetch when Salesforce is not configured

### Article Review

- Editable title
- Editable article number
- Editable product/feature
- Editable KB body

### Enrichment Generation

- Local deterministic generator when no API key exists
- Optional OpenAI-compatible LLM generation
- Standard structured output

### Output

- Markdown view
- JSON view
- Copy to clipboard
- Mock publish when Salesforce is not configured
- Salesforce publish when configured

## Future Features

- User authentication
- Draft persistence
- Reviewer assignment
- Approval workflow
- Version history
- Bulk article processing
- AI FCR prioritization dashboard
- Salesforce case/transcript mining
- Atonom export endpoint
- Prompt/template management
- Field mapping UI for Salesforce org differences
- Audit logs

## API Endpoints

### `GET /api/health`

Returns app status and whether Salesforce/AI are configured.

### `POST /api/kb/fetch`

Input:

```json
{ "input": "KB-12345" }
```

Returns:

```json
{ "article": {} }
```

### `POST /api/enrich`

Input:

```json
{ "article": {} }
```

Returns:

```json
{
  "layer": {},
  "markdown": "...",
  "mode": "local"
}
```

### `POST /api/publish`

Input:

```json
{ "layer": {} }
```

Returns Salesforce or mock publish result.

## Non-Goals for MVP

- Full Salesforce OAuth setup
- Production auth/SSO
- Persistent database
- Bulk processing
- Direct Claire/Atonom production integration

Those are intended next steps after the workflow is validated.
