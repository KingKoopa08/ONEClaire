# AI Knowledge Enrichment Layer

## Definition

The AI Knowledge Enrichment Layer is structured metadata and customer-facing guidance linked to a Salesforce Knowledge article.

It translates technician knowledge into approved AI support behavior.

## Required Sections

### Source Article

The Salesforce Knowledge article this layer is based on.

### Customer Intent

A short label describing what the customer is trying to solve.

Example:

```text
login_access_issue
```

### Customer Phrases

Realistic phrases customers may use.

Example:

```text
- I can’t log in
- It keeps sending me back to the sign-in screen
- My password works but I still can’t get in
```

### Symptoms

Observable signs of the issue.

Example:

```text
- Login loop
- Access denied message
- Timeout after SSO
```

### Common Error Messages

Exact or likely wording from the customer experience.

### Claire Search Terms

Terms Claire or Atonom can use for retrieval and matching.

### Customer-Safe Summary

A plain-English explanation Claire can safely use.

### Discovery Questions

Questions Claire should ask before troubleshooting or routing.

### Claire Can Try

Approved customer-safe actions.

### Do Not Say or Attempt

Things Claire must avoid.

Examples:

- Internal admin steps
- Backend commands
- Database references
- Security-sensitive instructions
- Promises of resolution

### Escalation Triggers

Conditions that require human handoff.

### Routing Recommendation

The correct queue, team, or product area.

### Required Salesforce Fields

Fields Claire should capture before handoff.

### Case Summary Template

Standard summary format for escalation.

### Confidence Score

A rough confidence value for the generated layer.

### Reviewer Questions

Open questions for Support/Product/Engineering reviewers.

## Example Output

```markdown
# AI Knowledge Enrichment Layer: Troubleshooting SSO Login Loop

**Intent:** login_access_issue

## Customer phrases
- I can’t log in
- It keeps sending me back to sign in
- I’m stuck in a login loop

## Discovery questions
- Are you using company sign-in?
- What exact error do you see?
- Did this start today?
- Are other users affected?

## Claire can try
- Confirm the affected account and login method.
- Capture the exact error message.
- Walk through approved browser/session checks.

## Escalation triggers
- SSO provider error
- Account disabled
- Multiple users affected
- Customer asks for a human

## Case summary template
Customer cannot log in via [method]. Error shown: [error]. Scope: [single/multiple users]. Steps attempted: [steps].
```
