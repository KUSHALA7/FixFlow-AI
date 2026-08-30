import { describe, it, expect } from 'vitest';
import { analyzeComplaint, calculateReadinessScore } from '../lib/diagnosis';

describe('Diagnosis Engine', () => {
  it('should diagnose washing machine grinding noise', () => {
    const result = analyzeComplaint('Washing Machine', 'making a loud grinding noise and not spinning');
    expect(result.likelyIssue).toContain('Drive Belt');
    expect(result.confidence).toBe(85);
  });

  it('should diagnose refrigerator not cooling', () => {
    const result = analyzeComplaint('Refrigerator', 'it is running all the time but not getting cold');
    expect(result.likelyIssue).toContain('Evaporator Coils');
    expect(result.confidence).toBe(80);
  });

  it('should return fallback for unknown complaints', () => {
    const result = analyzeComplaint('Television', 'it looks funny');
    expect(result.likelyIssue).toBe('Diagnosis Requires Inspection');
    expect(result.confidence).toBe(40);
  });
});

describe('Readiness Score', () => {
  it('should score 0 for empty', () => {
    expect(calculateReadinessScore(null, '')).toBe(0);
  });

  it('should score 40 for just appliance', () => {
    expect(calculateReadinessScore('Washing Machine', '')).toBe(40);
  });

  it('should score 60 for appliance and short text', () => {
    expect(calculateReadinessScore('Washing Machine', 'is broken now')).toBe(40); // 3 words, need > 5 for +20
    expect(calculateReadinessScore('Washing Machine', 'is broken right now and making a noise')).toBe(60); // 8 words
  });
});