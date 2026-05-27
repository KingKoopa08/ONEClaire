# Salesforce Setup Guide

## Goal

Create a place in Salesforce to store AI Knowledge Enrichment records linked to Salesforce Knowledge.

## Preferred Approach

Create a custom object:

```text
AI_Knowledge_Enrichment__c
```

This keeps AI-specific content separate from the official KB while maintaining traceability.

## Why Not Rewrite the KB Directly?

Because the KB is still useful for technicians.

The enrichment layer serves a different purpose:

- Customer wording
- AI search terms
- Claire-safe responses
- Escalation rules
- Routing metadata
- Case templates

## Suggested Fields

| Field API Name | Type | Purpose |
|---|---|---|
| Source_Article_Number__c | Text | Salesforce article number |
| Status__c | Picklist | Draft, Needs Review, Approved, Published, Retired |
| Customer_Intent__c | Text | Intent label |
| Customer_Phrases__c | Long Text | Customer wording examples |
| Symptoms__c | Long Text | Observable symptoms |
| Error_Messages__c | Long Text | Error text |
| Claire_Search_Terms__c | Long Text | Retrieval/search terms |
| Customer_Safe_Summary__c | Long Text | Plain-English summary |
| Discovery_Questions__c | Long Text | Questions Claire should ask |
| Claire_Can_Try__c | Long Text | Approved steps |
| Do_Not_Say_Or_Attempt__c | Long Text | Guardrails |
| Escalation_Triggers__c | Long Text | Handoff criteria |
| Routing_Recommendation__c | Text or Long Text | Queue/team recommendation |
| Required_Salesforce_Fields__c | Long Text | Fields Claire should capture |
| Case_Summary_Template__c | Long Text | Standard handoff summary |
| Confidence_Score__c | Number | Confidence value |
| Reviewer_Questions__c | Long Text | Questions for SMEs |

## Permissions

Recommended permission groups:

### Admin

- Full access to object and fields
- Can configure integration credentials

### Reviewer

- Read/create/edit enrichment records
- Can mark records approved if assigned

### Consumer / Integration

- Read approved records
- Create records only if using API publish

## Publishing Model

Recommended status flow:

```text
Draft → Needs Review → Approved → Published
```

Claire/Atonom should only consume approved or published records.

## Integration Notes

The current MVP uses `SALESFORCE_ACCESS_TOKEN` for simplicity.

Production should use an approved Salesforce auth pattern, likely one of:

- OAuth connected app
- JWT bearer flow
- Named credential through middleware
- Internal service account with scoped permissions

## Salesforce Knowledge Object Note

Salesforce Knowledge object and body field names vary by org.

The MVP attempts common fields, but the final implementation may need org-specific mapping.
