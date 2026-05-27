# Product and Engineering AI Support Readiness Standard

## Purpose

New features should launch with enough information for Claire to support customer questions in the future.

The standard is:

```text
Every feature must be documented in three languages:
Product language, Engineering language, and Customer language.
```

## Required AI Support Card

Each new feature should include an AI Support Card before launch.

## AI Support Card Template

### Feature Name

Name of the feature.

### Customer-Facing Description

Plain-English explanation of what the feature does.

### Common Customer Phrases

How customers may ask for help.

Example:

```text
- I can’t find the new button
- It won’t let me submit
- The page keeps spinning
```

### Expected Behavior

What should happen when the feature works correctly.

### Common Failure Modes

Known ways the feature can fail.

### Exact Error Messages

Any customer-visible error messages.

### Approved Claire Troubleshooting

Steps Claire may safely walk the customer through.

### Do Not Attempt

Steps Claire should never attempt.

### Required Data to Capture

Fields or context needed before escalation.

### Escalation Triggers

When Claire should route to a human.

### Routing Destination

Correct queue, team, or support group.

### Diagnostic Signals

Logs, flags, IDs, or system signals Engineering needs.

### Salesforce Case Fields

Required case fields and categories.

## Release Gate

A feature is not AI-support-ready until the AI Support Card is complete and reviewed.

This prevents the AI knowledge backlog from growing every time Product ships new features.

## Owner Responsibilities

### Product

- Customer-facing wording
- Expected behavior
- Known limitations
- Release context

### Engineering

- Failure modes
- Error messages
- Diagnostic signals
- Escalation boundaries

### Support

- Customer phrasing
- Discovery questions
- Routing
- Case summary expectations

### Claire/Atonom Team

- Intent naming
- AI behavior constraints
- Consumption format
