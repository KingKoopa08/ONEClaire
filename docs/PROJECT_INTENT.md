# Project Intent

## What We Are Building

ONE Claire is an internal utility for creating an AI Knowledge Enrichment Layer for Claire, the customer-facing AI support agent.

The tool helps convert technician-written Salesforce Knowledge articles into structured, customer-language guidance that Claire can use for:

- Better search
- Intent detection
- Discovery questions
- Safe customer troubleshooting
- Escalation decisions
- Routing
- Case summaries

## Why We Are Building It

Claire interacts with customers. Customers describe problems in plain language. Existing KBs are often written for support technicians.

That creates a translation gap.

A customer might say:

```text
I can’t get into my account.
```

A KB might say:

```text
Verify SSO federation status and inspect IdP claims.
```

Both may describe the same issue, but Claire needs a bridge between customer wording and technician knowledge.

ONE Claire creates that bridge.

## What This Is Not

ONE Claire is not:

- A replacement for Salesforce Knowledge
- A replacement for Product documentation
- A replacement for Engineering runbooks
- A public customer help center
- A tool that lets AI publish support content without review

## Core Principle

Salesforce Knowledge stays the source of truth.

ONE Claire creates a reviewed AI/customer layer on top of it.

Claire can use tech KBs for context, but should not read internal technician instructions directly to customers.

## Expected Outcome

The expected outcome is improved AI support performance:

- Higher AI First Contact Resolution
- Better containment
- Better routing
- Cleaner escalation handoffs
- Fewer repeat contacts
- Better customer experience
- Better agent context when AI escalates
