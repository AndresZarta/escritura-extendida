import { describe, it, expect } from 'vitest';
import { makeNoise1D, makeNoise2D, pick, ZALGO_UP, ZALGO_DOWN } from '../noise';

// ---------------------------------------------------------------------------
// makeNoise1D
// ---------------------------------------------------------------------------

describe('makeNoise1D', () => {
  it('returns values in [0, 1]', () => {
    const noise = makeNoise1D();
    for (let x = -10; x <= 10; x += 0.37) {
      const v = noise(x);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('returns finite, non-NaN values', () => {
    const noise = makeNoise1D();
    for (let x = 0; x < 100; x += 1.1) {
      const v = noise(x);
      expect(Number.isFinite(v)).toBe(true);
      expect(Number.isNaN(v)).toBe(false);
    }
  });

  it('each factory call produces an independent noise function', () => {
    const noiseA = makeNoise1D();
    const noiseB = makeNoise1D();
    // Different perm tables → values will differ at some point across many samples
    let differ = false;
    for (let x = 0; x < 50; x += 0.5) {
      if (Math.abs(noiseA(x) - noiseB(x)) > 1e-9) { differ = true; break; }
    }
    expect(differ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// makeNoise2D → noise2d
// ---------------------------------------------------------------------------

describe('makeNoise2D – noise2d', () => {
  it('returns values in [0, 1]', () => {
    const { noise2d } = makeNoise2D();
    for (let x = -5; x <= 5; x += 0.6) {
      for (let y = -5; y <= 5; y += 0.6) {
        const v = noise2d(x, y);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  it('returns finite, non-NaN values', () => {
    const { noise2d } = makeNoise2D();
    for (let x = 0; x < 20; x += 0.7) {
      for (let y = 0; y < 20; y += 0.7) {
        const v = noise2d(x, y);
        expect(Number.isFinite(v)).toBe(true);
        expect(Number.isNaN(v)).toBe(false);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// makeNoise2D → fbm
// ---------------------------------------------------------------------------

describe('makeNoise2D – fbm', () => {
  it('returns values in [0, 1]', () => {
    const { fbm } = makeNoise2D();
    for (let x = -3; x <= 3; x += 0.5) {
      for (let y = -3; y <= 3; y += 0.5) {
        const v = fbm(x, y);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  it('returns finite, non-NaN values', () => {
    const { fbm } = makeNoise2D();
    for (let x = 0; x < 10; x += 1.3) {
      const v = fbm(x, x * 0.7);
      expect(Number.isFinite(v)).toBe(true);
      expect(Number.isNaN(v)).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// makeNoise2D → warpedFbm
// ---------------------------------------------------------------------------

describe('makeNoise2D – warpedFbm', () => {
  it('returns values in [0, 1]', () => {
    const { warpedFbm } = makeNoise2D();
    for (let x = -2; x <= 2; x += 0.4) {
      for (let y = -2; y <= 2; y += 0.4) {
        for (const t of [0, 1, 5, 100]) {
          const v = warpedFbm(x, y, t);
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it('returns finite, non-NaN values', () => {
    const { warpedFbm } = makeNoise2D();
    for (let t = 0; t < 200; t += 13.7) {
      const v = warpedFbm(1.5, 2.3, t);
      expect(Number.isFinite(v)).toBe(true);
      expect(Number.isNaN(v)).toBe(false);
    }
  });

  it('produces different outputs for different t values', () => {
    const { warpedFbm } = makeNoise2D();
    const v0 = warpedFbm(1, 1, 0);
    const v1 = warpedFbm(1, 1, 50);
    // Domain-warping with t should shift the output
    expect(Math.abs(v0 - v1)).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Zalgo arrays
// ---------------------------------------------------------------------------

describe('ZALGO_UP / ZALGO_DOWN', () => {
  it('ZALGO_UP contains combining characters in the U+0300–U+036F range', () => {
    expect(ZALGO_UP.length).toBeGreaterThan(0);
    for (const ch of ZALGO_UP) {
      const cp = ch.codePointAt(0)!;
      expect(cp).toBeGreaterThanOrEqual(0x0300);
      expect(cp).toBeLessThanOrEqual(0x036f);
    }
  });

  it('ZALGO_DOWN contains combining characters in the U+0316–U+0333 range', () => {
    expect(ZALGO_DOWN.length).toBeGreaterThan(0);
    for (const ch of ZALGO_DOWN) {
      const cp = ch.codePointAt(0)!;
      expect(cp).toBeGreaterThanOrEqual(0x0316);
      expect(cp).toBeLessThanOrEqual(0x0333);
    }
  });
});

// ---------------------------------------------------------------------------
// pick
// ---------------------------------------------------------------------------

describe('pick', () => {
  it('returns an element from the array', () => {
    const arr = [1, 2, 3, 4, 5];
    for (let i = 0; i < 20; i++) {
      const v = pick(arr);
      expect(arr).toContain(v);
    }
  });

  it('works with a single-element array', () => {
    expect(pick(['only'])).toBe('only');
  });
});
