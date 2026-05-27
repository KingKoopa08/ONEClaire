# ONE Claire Instruction Manual

## 1. What ONE Claire Is

ONE Claire is a web-based utility for creating an **AI Knowledge Enrichment Layer** on top of existing Salesforce Knowledge articles.

The purpose is simple:

- Salesforce Knowledge remains the official source of truth.
- ONE Claire converts technician-written KB content into customer-language AI guidance.
- Claire uses the enriched layer to better understand customer wording, ask the right questions, attempt approved steps, and escalate with clean context.

ONE Claire is not meant to replace Salesforce Knowledge, Product documentation, or Engineering runbooks. It creates a controlled customer-facing support layer that sits on top of them.

## 2. Why This Exists

Many KBs are written for technical support teams. Customers do not describe issues the same way technicians document them.

Example:

- Technician KB wording: “Verify SSO federation status and confirm IdP assertion claims.”
- Customer wording: “I can’t log in” or “It keeps sending me back to the sign-in screen.”

Without an enrichment layer, Claire may:

- Search the wrong article.
- Miss the customer’s intent.
- Read technical language that customers do not understand.
- Escalate too early.
- Escalate with weak case notes.
- Route to the wrong queue.

ONE Claire solves this by creating structured, customer-language guidance tied back to the original KB.

## 3. Core Concepts

### Salesforce Knowledge

The source article. This remains the official support knowledge article.

### AI Knowledge Enrichment Layer

The generated customer-facing layer that includes:

- Customer phrases
- Symptoms
- Common error messages
- Claire search terms
- Customer-safe summary
- Discovery questions
- Approved troubleshooting steps
- Things Claire must not say or attempt
- Escalation triggers
- Routing recommendation
- Required Salesforce fields
- Case summary template
- Reviewer questions
- Confidence score

### Claire

The AI voice/chat agent that customers interact with.

### Atonom

The AI orchestration layer behind Claire. Depending on final architecture, Atonom may consume the enrichment output directly or through Salesforce.

### Salesforce

System of record for customers, cases, routing, and Knowledge.

## 4. How ONE Claire Works

High-level flow:

1. User opens ONE Claire.
2. User provides a Salesforce KB URL, article number, or manually pasted KB text.
3. ONE Claire loads the KB content.
4. User clicks **Generate AI Layer**.
5. ONE Claire creates a draft AI Knowledge Enrichment Layer.
6. User reviews and edits the draft.
7. User copies Markdown/JSON or publishes it to Salesforce when credentials are configured.
8. Approved enrichment content becomes available for Claire/Atonom workflows.

## 5. Current MVP Capabilities

The current version works without Salesforce credentials or an AI API key.

Available now:

- Manual article paste mode
- Mock Salesforce article fetch mode
- Local deterministic generator
- Markdown output
- JSON output
- Copy-to-clipboard workflow
- Mock publish response
- Docker support
- Optional Salesforce and LLM integration through environment variables

This allows the team to test the workflow before credentials are available.

## 6. Running Locally

### Requirements

- Node.js 22+
- npm

### Install

```bash
npm install
```

### Start dev mode

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

The API runs at:

```text
http://localhost:8787
```

### Build production version

```bash
npm run build
```

### Start production build

```bash
npm start
```

Open:

```text
http://localhost:8787
```

## 7. Running With Docker

### Build and run

```bash
cp .env.example .env
# Edit .env if credentials are available.
docker compose up --build
```

Open:

```text
http://localhost:8787
```

If no `.env` file exists, docker compose is configured to continue using mock/local mode.

## 8. Environment Variables

```bash
PORT=8787

# Optional Salesforce connection. Without these, mock mode is used.
SALESFORCE_INSTANCE_URL=https://your-domain.my.salesforce.com
SALESFORCE_ACCESS_TOKEN=***
SALESFORCE_API_VERSION=v61.0
SALESFORCE_ENRICHMENT_OBJECT=AI_Knowledge_Enrichment__c

# Optional OpenAI-compatible LLM. Without this, local generation is used.
OPENAI_API_KEY=***
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

## 9. Using the App

### Step 1: Load a KB

You can load a KB three ways:

1. Paste a Salesforce Knowledge URL.
2. Enter a KB/article number.
3. Paste article text manually into the source article editor.

If Salesforce credentials are not configured, the app returns a mock article so the workflow can still be tested.

### Step 2: Review Source Article

Check:

- Article number
- Title
- Product or feature
- Body content

If needed, edit the content manually before generating.

### Step 3: Generate AI Layer

Click **Generate AI Layer**.

If an LLM key is configured, ONE Claire uses the configured model.

If no LLM key is configured, ONE Claire uses the built-in local generator. The local generator is useful for demos and structure testing, but final production quality should use an approved LLM and human review.

### Step 4: Review Output

Review the generated output carefully.

Pay close attention to:

- Whether customer phrases sound realistic.
- Whether the summary is customer-safe.
- Whether troubleshooting steps are safe for Claire to perform.
- Whether internal admin/backend instructions are hidden from the customer.
- Whether escalation triggers are correct.
- Whether routing recommendation is accurate.
- Whether the case summary template captures the right fields.

### Step 5: Copy or Publish

You can copy:

- Markdown
- JSON

When Salesforce credentials and the custom object are configured, the publish button can push the enrichment record to Salesforce.

## 10. Review and Approval Rules

AI-generated output should always start as a draft.

Do not approve enrichment content without human review when it involves:

- Security
- Billing
- Compliance
- Data loss
- Account access
- Admin-only tools
- Backend changes
- Engineering investigation
- Destructive actions

Claire should not perform risky actions. Claire should collect context and escalate.

## 11. Recommended Salesforce Setup

Preferred custom object:

```text
AI_Knowledge_Enrichment__c
```

Recommended fields:

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

Recommended statuses:

- Draft
- Needs Review
- Approved
- Published
- Retired

## 12. Recommended Operating Model

### Support Ops

Owns the enrichment workflow and prioritization.

### Product

Provides feature context, customer-facing language, expected behavior, and known limitations.

### Engineering

Provides failure modes, error messages, diagnostic signals, and escalation boundaries.

### Salesforce Admin

Owns the Salesforce object, fields, permissions, and publish path.

### Claire/Atonom Team

Defines how approved enrichment records are consumed by Claire.

## 13. Prioritization Model

There are three valid ways to choose KBs:

### Option 1: Top 50 KBs

Good when leadership wants a clean starting scope.

### Option 2: AI FCR Gap

Best when the goal is measurable business impact. Select issues Claire is not resolving well today.

### Option 3: Blended

Recommended. Start where high contact volume overlaps poor AI FCR and existing KB readiness.

Suggested scoring inputs:

- Contact volume
- AI FCR / containment failure
- Escalation rate
- Wrong-route rate
- Repeat contact rate
- Customer pain
- SLA/business risk
- KB readiness
- SME availability

## 14. Success Metrics

Track before and after:

- AI First Contact Resolution
- Containment rate
- Escalation rate
- Wrong-route rate
- No-answer or low-confidence search events
- Repeat contact rate
- Agent handle time after transfer
- Case summary quality
- Number of AI-ready KBs
- Review cycle time

## 15. Troubleshooting

### App says Salesforce is in mock mode

Salesforce env vars are missing. Set:

```bash
SALESFORCE_INSTANCE_URL
SALESFORCE_ACCESS_TOKEN
```

### App says AI is local generator

LLM env vars are missing. Set:

```bash
OPENAI_API_KEY
OPENAI_BASE_URL
OPENAI_MODEL
```

### Publish returns mock result

Salesforce credentials are missing or publish object is not configured.

### Salesforce fetch fails

Check:

- Token validity
- Salesforce instance URL
- API version
- Knowledge object API name
- Article number
- Field-level permissions

### Docker build fails

Confirm Docker Desktop or Colima is running.

## 16. Production Notes

Before production use:

- Confirm Salesforce authentication method.
- Confirm Salesforce Knowledge object and body field names.
- Create the enrichment custom object.
- Add proper user authentication to ONE Claire if exposed beyond local/internal use.
- Add persistent database if draft storage is needed.
- Add audit logging for reviews and publishes.
- Decide whether Atonom reads from Salesforce or a JSON/API export.
- Define approval workflow and owners.

## 17. The Rule That Matters Most

Claire should not read technician KBs directly to customers.

Claire should use approved enrichment content to translate technical knowledge into customer-safe support guidance.
