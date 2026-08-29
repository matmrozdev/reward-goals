import { normalizeProgress } from './normalize-progress';

describe('normalizeProgress', () => {
  it('returns the fraction for a value within the progress range', () => {
    const result = normalizeProgress({ max: 20, value: 12 });

    expect(result).toEqual({ fraction: 0.6, max: 20, value: 12 });
  });

  it('clamps values outside the progress range', () => {
    const belowRange = normalizeProgress({ max: 20, value: -1 });
    const aboveRange = normalizeProgress({ max: 20, value: 21 });

    expect(belowRange).toEqual({ fraction: 0, max: 20, value: 0 });
    expect(aboveRange).toEqual({ fraction: 1, max: 20, value: 20 });
  });

  it('returns empty progress for invalid values', () => {
    const invalidMax = normalizeProgress({ max: Number.NaN, value: 1 });
    const invalidValue = normalizeProgress({ max: 20, value: Number.NaN });

    expect(invalidMax).toEqual({ fraction: 0, max: 0, value: 0 });
    expect(invalidValue).toEqual({ fraction: 0, max: 20, value: 0 });
  });
});
