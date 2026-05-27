# Pilot and Metrics Plan

## Pilot Goal

Prove that an AI Knowledge Enrichment Layer improves Claire’s ability to resolve or route customer issues.

## Candidate Selection Options

### Option 1: Top 50 KBs

Select the top 50 Salesforce Knowledge articles by usage, case association, or support visibility.

Good for:

- Simple executive story
- Fast content coverage
- Broad initial cleanup

Risk:

- Top viewed articles may not match Claire’s biggest AI FCR gaps.

### Option 2: AI FCR Gap

Select issues where Claire is currently not performing well.

Good for:

- Highest measurable impact
- Direct AI improvement
- Better containment/routing metrics

Requires:

- AI FCR data
- Escalation data
- Call/chat driver data

### Option 3: Blended

Recommended.

Start where high-volume contact drivers overlap with low AI FCR and existing KB readiness.

## Suggested Scoring Model

Score each candidate from 1 to 5:

- Contact volume
- AI FCR gap
- Escalation rate
- Wrong-route rate
- Repeat contact rate
- Customer pain
- Business/SLA risk
- KB readiness
- SME availability

Prioritize the highest total scores.

## 30-Day Pilot

### Week 1

- Confirm data sources.
- Confirm AI FCR definition.
- Pick candidate selection method.
- Select 10 to 20 pilot issues.
- Confirm reviewers.

### Week 2

- Generate enrichment drafts in ONE Claire.
- Review with Support SMEs.
- Identify missing Product/Engineering info.

### Week 3

- Approve first enrichment records.
- Connect approved records to Claire/Atonom workflow if available.
- Begin tracking performance.

### Week 4

- Compare before/after metrics.
- Identify gaps.
- Prepare scale-up recommendation.

## Success Metrics

### AI Performance

- AI First Contact Resolution
- Containment rate
- No-answer search rate
- Low-confidence search rate
- Escalation rate
- Wrong-route rate

### Customer Impact

- Repeat contact rate
- CSAT by intent
- Time to first useful answer

### Agent Impact

- Handoff summary quality
- Average handle time after transfer
- Missing required fields on escalation

### Operational Health

- AI-ready KB count
- Review cycle time
- Stale enrichment count
- Coverage by product area

## Pilot Exit Criteria

The pilot is successful if:

- Enrichment records can be created repeatably.
- SMEs can review them without excessive effort.
- Claire search/routing improves for selected issues.
- Escalated cases contain better context.
- Leadership has clear data for scale-up.
