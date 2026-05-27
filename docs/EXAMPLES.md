# Examples

## Example 1: Login Issue

### Original Tech KB

```text
Verify SSO federation status in Admin Console. Confirm IdP assertion includes NameID and required claims. If mismatch exists, escalate to IAM.
```

### Customer Phrases

```text
- I can’t log in
- It keeps sending me back to sign in
- My password works but I still can’t get in
- I’m stuck in a login loop
```

### Customer-Safe Summary

```text
This may be related to how your organization signs you in. I’ll collect a few details and try the customer-safe checks first. If it requires account configuration, I’ll route this to the access team.
```

### Discovery Questions

```text
- Are you using company sign-in or a username and password?
- What exact error do you see?
- Did this start today?
- Are other users affected?
```

### Escalation Triggers

```text
- SSO provider error
- Account disabled
- Multiple users affected
- Customer asks for a human
```

## Example 2: Disabled Button

### Original Tech KB

```text
Validate workflow state and entitlement flags. Confirm required fields have been populated before submission.
```

### Customer Phrases

```text
- The submit button is greyed out
- It won’t let me continue
- I filled everything out but can’t submit
```

### Customer-Safe Summary

```text
The system may be waiting for required information or the item may be in a state that does not allow submission yet. I’ll help check the visible fields and capture the details if this needs a support agent.
```

### Claire Can Try

```text
- Ask which page or workflow the customer is on.
- Ask whether any required fields are highlighted.
- Ask what changed before the button became unavailable.
- Confirm whether the customer has permission to perform the action.
```

### Escalation Triggers

```text
- Required fields are complete but the button remains disabled
- Customer permission issue is suspected
- Workflow state appears locked
- Customer cannot proceed after approved checks
```
