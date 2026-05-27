# AI Enrichment Review Checklist

Use this checklist before approving an AI Knowledge Enrichment Layer.

## Source Validation

- [ ] Correct Salesforce KB article linked
- [ ] Article is current
- [ ] Product/feature is correct
- [ ] Source process is still valid

## Customer Language

- [ ] Customer phrases sound realistic
- [ ] Symptoms match how customers report the issue
- [ ] Error messages are customer-visible
- [ ] Internal jargon is removed or translated

## Claire Behavior

- [ ] Discovery questions are clear
- [ ] Troubleshooting steps are safe
- [ ] Claire does not expose internal systems unnecessarily
- [ ] Claire does not promise a fix it cannot perform
- [ ] Claire knows when to stop troubleshooting

## Risk Review

- [ ] No security-sensitive instructions exposed
- [ ] No billing-sensitive actions allowed without escalation
- [ ] No destructive actions allowed
- [ ] No admin-only steps assigned to the customer
- [ ] Compliance risks reviewed

## Escalation and Routing

- [ ] Escalation triggers are clear
- [ ] Routing queue/team is correct
- [ ] Required Salesforce fields are listed
- [ ] Case summary template is useful

## Approval

- [ ] Support SME reviewed
- [ ] Product reviewed if feature behavior is involved
- [ ] Engineering reviewed if backend or failure mode detail is involved
- [ ] Salesforce admin reviewed field/object mapping if publishing
- [ ] Status updated to Approved or Published
