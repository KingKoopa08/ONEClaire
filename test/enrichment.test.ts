import { describe, expect, it } from 'vitest';
import { buildDeterministicLayer, layerToMarkdown } from '../src/server/enrichment';

describe('AI Knowledge Enrichment generator', () => {
  it('creates a useful draft layer from a technician KB', () => {
    const layer = buildDeterministicLayer({
      source: 'manual',
      articleNumber: 'KB-123',
      title: 'Troubleshooting SSO Login Loop',
      product: 'Identity',
      body: 'Verify SSO federation status in Admin Console. Confirm IdP assertion includes NameID and required claims. If the customer sees access denied or timeout, escalate to IAM with logs.'
    });

    expect(layer.sourceArticleNumber).toBe('KB-123');
    expect(layer.customerIntent).toContain('troubleshooting_sso_login_loop');
    expect(layer.customerPhrases.length).toBeGreaterThan(2);
    expect(layer.doNotSayOrAttempt.join(' ')).toMatch(/internal|admin/i);
    expect(layer.escalationTriggers.join(' ')).toMatch(/human|admin/i);
    expect(layer.confidenceScore).toBeGreaterThan(0);
  });

  it('exports markdown for copy paste workflows', () => {
    const layer = buildDeterministicLayer({
      source: 'manual',
      title: 'Claim submit button disabled',
      body: 'Check entitlement flags. Verify all required fields are populated. If workflow state is locked, route to product support.'
    });
    const md = layerToMarkdown(layer);
    expect(md).toContain('# AI Knowledge Enrichment Layer');
    expect(md).toContain('## Escalation triggers');
    expect(md).toContain('## Case summary template');
  });
});
