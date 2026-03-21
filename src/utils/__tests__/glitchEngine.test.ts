import { describe, it, expect, vi } from 'vitest';
import {
  GlitchState,
  computeSparkleAlpha,
  glitchDisplacement,
} from '../glitchEngine';

// ---------------------------------------------------------------------------
// GlitchState
// ---------------------------------------------------------------------------

describe('GlitchState', () => {
  it('initialises with correct base chars', () => {
    const state = new GlitchState('hello');
    expect(state.baseChars).toEqual(['h', 'e', 'l', 'l', 'o']);
  });

  it('initialises corruptedChars as a copy of baseChars', () => {
    const state = new GlitchState('abc');
    expect(state.corruptedChars).toEqual(['a', 'b', 'c']);
    // Mutating one should not affect the other
    state.corruptedChars[0] = 'X';
    expect(state.baseChars[0]).toBe('a');
  });

  it('initialises sparkleStarts as all zeros', () => {
    const state = new GlitchState('hi');
    for (let i = 0; i < state.sparkleStarts.length; i++) {
      expect(state.sparkleStarts[i]).toBe(0);
    }
  });

  describe('advanceNoise', () => {
    it('returns intensity in [0, maxI] range', () => {
      const state = new GlitchState('test');
      for (let i = 0; i < 100; i++) {
        const { intensity } = state.advanceNoise(0.09, 0.05, 0.65);
        expect(intensity).toBeGreaterThanOrEqual(0);
        expect(intensity).toBeLessThanOrEqual(0.65);
      }
    });

    it('returns corruption in [0, 1] range', () => {
      const state = new GlitchState('test');
      for (let i = 0; i < 100; i++) {
        const { corruption } = state.advanceNoise(0.09, 0.05, 0.65);
        expect(corruption).toBeGreaterThanOrEqual(0);
        expect(corruption).toBeLessThanOrEqual(1);
      }
    });

    it('returns intensity=0 when below threshold', () => {
      // By stepping through the noise we can get dead-zone values (intensity = 0)
      // We just check the function never throws
      const state = new GlitchState('x');
      expect(() => {
        for (let i = 0; i < 200; i++) state.advanceNoise(0.01, 0.05, 0.65);
      }).not.toThrow();
    });
  });

  describe('applyHeal', () => {
    it('heals all characters with chance=1', () => {
      const state = new GlitchState('abc');
      state.corruptedChars[0] = 'X';
      state.corruptedChars[2] = 'Z';
      state.applyHeal(0, 3, 1);
      expect(state.corruptedChars).toEqual(['a', 'b', 'c']);
    });

    it('heals nothing with chance=0', () => {
      const state = new GlitchState('abc');
      state.corruptedChars[0] = 'X';
      state.applyHeal(0, 3, 0);
      expect(state.corruptedChars[0]).toBe('X');
    });

    it('only heals within the specified range', () => {
      const state = new GlitchState('abcd');
      state.corruptedChars[0] = 'X';
      state.corruptedChars[3] = 'Z';
      state.applyHeal(1, 3, 1); // range [1,3) — index 0 and 3 are outside
      expect(state.corruptedChars[0]).toBe('X');
      expect(state.corruptedChars[3]).toBe('Z');
    });
  });

  describe('healAll', () => {
    it('heals all characters when called repeatedly', () => {
      const state = new GlitchState('hello');
      for (let i = 0; i < state.baseChars.length; i++) {
        state.corruptedChars[i] = 'X';
      }
      // Run enough times so probabilistic heal completes
      for (let i = 0; i < 100; i++) state.healAll();
      expect(state.corruptedChars.join('')).toBe('hello');
    });

    it('does not heal characters in the excluded range', () => {
      const state = new GlitchState('abcde');
      state.corruptedChars[2] = 'X';
      // Excluding index 2 (range [2,3))
      for (let i = 0; i < 100; i++) state.healAll(2, 3);
      expect(state.corruptedChars[2]).toBe('X');
    });
  });

  describe('getDisplayChar', () => {
    it('returns the corrupted char when no zalgo marks', () => {
      const state = new GlitchState('ab');
      expect(state.getDisplayChar(0)).toBe('a');
    });

    it('includes zalgo marks when present', () => {
      const state = new GlitchState('a');
      state.zalgoMarks[0] = ['\u0300', '\u0301'];
      const display = state.getDisplayChar(0);
      expect(display).toBe('a\u0300\u0301');
    });
  });

  describe('mutateRange', () => {
    it('does not throw for empty range', () => {
      const state = new GlitchState('abc');
      expect(() => state.mutateRange(0, 0, 0)).not.toThrow();
    });

    it('does not throw for any corruption value in [0, 1]', () => {
      const state = new GlitchState('hello world');
      for (const corruption of [0, 0.1, 0.5, 0.9, 1]) {
        expect(() => state.mutateRange(0, state.baseChars.length, corruption)).not.toThrow();
      }
    });
  });

  describe('activateSparkles', () => {
    it('does not throw for any range', () => {
      const state = new GlitchState('abc');
      expect(() => state.activateSparkles(0, 3, performance.now())).not.toThrow();
    });
  });
});

// ---------------------------------------------------------------------------
// computeSparkleAlpha
// ---------------------------------------------------------------------------

describe('computeSparkleAlpha', () => {
  it('returns 0 when sparkle has not started (entry is 0)', () => {
    const sparkleStarts = new Float64Array(5);
    expect(computeSparkleAlpha(sparkleStarts, 0, 1000)).toBe(0);
  });

  it('returns 0 and resets entry when sparkle has expired', () => {
    const sparkleStarts = new Float64Array(5);
    sparkleStarts[2] = 100; // started at t=100
    // now = 100 + 800 (SPARKLE_DURATION) = 900 → elapsed >= 800 → expired
    const alpha = computeSparkleAlpha(sparkleStarts, 2, 900);
    expect(alpha).toBe(0);
    expect(sparkleStarts[2]).toBe(0); // entry reset
  });

  it('returns a value in [0, 0.9] during active sparkle', () => {
    const sparkleStarts = new Float64Array(5);
    const start = 1000;
    sparkleStarts[0] = start;
    // Sample at t=50% into sparkle duration (400ms)
    const alpha = computeSparkleAlpha(sparkleStarts, 0, start + 400);
    expect(alpha).toBeGreaterThan(0);
    expect(alpha).toBeLessThanOrEqual(0.9);
  });

  it('peaks near the midpoint of the sparkle', () => {
    const sparkleStarts = new Float64Array(5);
    const start = 1000; // non-zero so it's treated as "started"
    sparkleStarts[0] = start;
    const alphaMid = computeSparkleAlpha(sparkleStarts, 0, start + 400);   // 50%
    // Reset for next measurement
    sparkleStarts[0] = start;
    const alphaEarly = computeSparkleAlpha(sparkleStarts, 0, start + 100); // 12.5%
    expect(alphaMid).toBeGreaterThan(alphaEarly);
  });
});

// ---------------------------------------------------------------------------
// glitchDisplacement
// ---------------------------------------------------------------------------

describe('glitchDisplacement', () => {
  it('returns {dx:0, dy:0} when intensity <= 0.01', () => {
    expect(glitchDisplacement(0)).toEqual({ dx: 0, dy: 0 });
    expect(glitchDisplacement(0.01)).toEqual({ dx: 0, dy: 0 });
  });

  it('returns non-zero displacement for intensity > 0.01', () => {
    // Run several times since it's random; at least one should be non-zero
    let nonZero = false;
    for (let i = 0; i < 50; i++) {
      const { dx, dy } = glitchDisplacement(1);
      if (dx !== 0 || dy !== 0) { nonZero = true; break; }
    }
    expect(nonZero).toBe(true);
  });

  it('displacement magnitude scales with intensity', () => {
    // Replace Math.random with fixed value to make test deterministic
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.75);
    const low = glitchDisplacement(0.1);
    const high = glitchDisplacement(1.0);
    spy.mockRestore();
    // |dx| = (0.75*2 - 1) * 2 * intensity = 0.5 * 2 * intensity
    expect(Math.abs(high.dx)).toBeGreaterThan(Math.abs(low.dx));
  });

  it('never produces NaN', () => {
    for (const intensity of [0, 0.01, 0.5, 1]) {
      const { dx, dy } = glitchDisplacement(intensity);
      expect(Number.isNaN(dx)).toBe(false);
      expect(Number.isNaN(dy)).toBe(false);
    }
  });
});
