// Shared glitch state management and rendering helpers
// used by GlitchText and GlitchParagraph components.

import { makeNoise1D, ZALGO_UP, ZALGO_DOWN, pick } from './noise';

export interface GlitchSignals {
  intensity: number;
  corruption: number;
}

export class GlitchState {
  readonly baseChars: string[];
  readonly corruptedChars: string[];
  readonly zalgoMarks: string[][];
  readonly sparkleStarts: Float64Array;
  private noiseT: number;
  private stabilityT: number;
  private readonly noise1d: (x: number) => number;
  private readonly noise1d2: (x: number) => number;

  constructor(text: string) {
    this.baseChars = text.split('');
    this.corruptedChars = [...this.baseChars];
    this.zalgoMarks = this.baseChars.map(() => []);
    this.sparkleStarts = new Float64Array(text.length + 100);
    this.noiseT = Math.random() * 1000;
    this.stabilityT = Math.random() * 1000;
    this.noise1d = makeNoise1D();
    this.noise1d2 = makeNoise1D();
  }

  /** Advance noise walks and return intensity/corruption signals with dead zones. */
  advanceNoise(oscSpeed: number, minI: number, maxI: number): GlitchSignals {
    this.noiseT += oscSpeed * 0.3;
    this.stabilityT += oscSpeed * 0.2;

    const rawIntensity = this.noise1d(this.noiseT);
    const intensity = rawIntensity < 0.3
      ? 0
      : minI + (maxI - minI) * ((rawIntensity - 0.3) / 0.7);

    const rawCorruption = this.noise1d2(this.stabilityT);
    const corruption = rawCorruption < 0.4
      ? 0
      : Math.min(1, (rawCorruption - 0.4) / 0.35);

    return { intensity, corruption };
  }

  /** Heal corrupted characters back to base with given probability. */
  applyHeal(start: number, end: number, chance: number): void {
    for (let i = start; i < end; i++) {
      if (this.corruptedChars[i] !== this.baseChars[i] && Math.random() < chance) {
        this.corruptedChars[i] = this.baseChars[i];
      }
    }
  }

  /** Swap adjacent non-space characters with given probability. */
  applySwaps(start: number, end: number, probability: number): void {
    for (let i = start; i < end - 1; i++) {
      if (this.corruptedChars[i] !== ' ' && this.corruptedChars[i + 1] !== ' ' && Math.random() < probability) {
        [this.corruptedChars[i], this.corruptedChars[i + 1]] = [this.corruptedChars[i + 1], this.corruptedChars[i]];
        i++;
      }
    }
  }

  /** Accumulate/shed zalgo combining marks based on corruption level. */
  applyZalgoAccum(start: number, end: number, corruption: number): void {
    for (let i = start; i < end; i++) {
      if (this.corruptedChars[i] === ' ') continue;
      if (corruption > 0.1 && Math.random() < 0.12 * corruption && this.zalgoMarks[i].length < 15) {
        this.zalgoMarks[i].push(Math.random() < 0.5 ? pick(ZALGO_UP) : pick(ZALGO_DOWN));
      }
      const shedChance = corruption < 0.01 ? 0.25 : 0.08 * (1 - corruption);
      if (this.zalgoMarks[i].length > 0 && Math.random() < shedChance) {
        this.zalgoMarks[i].pop();
      }
    }
  }

  /** Apply the standard mutation pipeline (heal + swap + zalgo) for a range. */
  mutateRange(start: number, end: number, corruption: number): void {
    const healChance = corruption < 0.01 ? 0.3 : 0.12 * (1 - corruption);
    this.applyHeal(start, end, healChance);

    if (corruption > 0.1 && Math.random() < 0.5 * corruption) {
      this.applySwaps(start, end, 0.15 * corruption);
    }

    this.applyZalgoAccum(start, end, corruption);
  }

  /** Heal all characters to base, optionally excluding a range. */
  healAll(excludeStart = -1, excludeEnd = -1): void {
    for (let i = 0; i < this.baseChars.length; i++) {
      if (i >= excludeStart && i < excludeEnd) continue;
      if (this.corruptedChars[i] !== this.baseChars[i]) this.corruptedChars[i] = this.baseChars[i];
      if (this.zalgoMarks[i].length > 0 && Math.random() < 0.3) this.zalgoMarks[i].pop();
    }
  }

  /** Get display string for a character (base + zalgo marks). */
  getDisplayChar(idx: number): string {
    return this.zalgoMarks[idx].length > 0
      ? this.corruptedChars[idx] + this.zalgoMarks[idx].join('')
      : this.corruptedChars[idx];
  }

  /** Randomly activate sparkles on characters in range. */
  activateSparkles(start: number, end: number, now: number): void {
    for (let i = start; i < end; i++) {
      if (this.sparkleStarts[i] === 0 && Math.random() < 0.003) {
        this.sparkleStarts[i] = now;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Rendering helpers
// ---------------------------------------------------------------------------

const SPARKLE_COLOR = 'rgb(140, 180, 255)';
const SPARKLE_DURATION = 800;

/** Compute sparkle alpha; returns 0 when inactive. Resets entry when sparkle finishes. */
export function computeSparkleAlpha(sparkleStarts: Float64Array, idx: number, now: number): number {
  const start = sparkleStarts[idx];
  if (start <= 0) return 0;
  const elapsed = now - start;
  if (elapsed >= SPARKLE_DURATION) {
    sparkleStarts[idx] = 0;
    return 0;
  }
  const t = elapsed / SPARKLE_DURATION;
  return (t < 0.5 ? t * 2 : (1 - t) * 2) * 0.9;
}

/** Render a sparkle color overlay for a character. */
export function renderSparkle(
  ctx: CanvasRenderingContext2D,
  displayCh: string,
  x: number, y: number,
  alpha: number,
  baseColor: string
): void {
  ctx.fillStyle = SPARKLE_COLOR;
  ctx.globalAlpha = alpha;
  ctx.fillText(displayCh, x, y);
  ctx.fillStyle = baseColor;
  ctx.globalAlpha = 1;
}

/** Render a micro-slice glitch for a character region. */
export function renderMicroSlice(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  x: number, baselineY: number,
  charWidth: number,
  fontSize: number,
  intensity: number,
  dpr: number
): void {
  if (intensity <= 0.01 || Math.random() >= 0.25 * intensity) return;
  const sliceY = baselineY + (Math.random() * -fontSize * 0.7 + fontSize * 0.1);
  const sliceH = Math.random() * 6 + 2;
  const shift = (Math.random() * 48 - 24) * intensity;
  try {
    ctx.drawImage(
      canvas,
      x * dpr, sliceY * dpr, charWidth * dpr, sliceH * dpr,
      x + shift, sliceY, charWidth, sliceH
    );
  } catch { /* bounds */ }
}

/** Render horizontal tear effects in a rectangular region. */
export function renderTears(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  intensity: number,
  regionX: number, regionY: number,
  regionW: number, regionH: number,
  dpr: number
): void {
  const tearCount = Math.random() < 0.5 * intensity
    ? Math.floor(2 + Math.random() * 6 * intensity)
    : 0;

  for (let t = 0; t < tearCount; t++) {
    const ty = regionY + Math.random() * regionH;
    const th = Math.random() * 6 + 2;
    const shift = (Math.random() * 30 - 15) * intensity;
    try {
      ctx.drawImage(
        canvas,
        regionX * dpr, ty * dpr, regionW * dpr, th * dpr,
        regionX + shift, ty, regionW, th
      );
    } catch { /* bounds */ }
  }
}

/** Compute displacement offsets for a glitching character. */
export function glitchDisplacement(intensity: number): { dx: number; dy: number } {
  if (intensity <= 0.01) return { dx: 0, dy: 0 };
  return {
    dx: (Math.random() * 2 - 1) * 2 * intensity,
    dy: (Math.random() * 2 - 1) * 2 * intensity,
  };
}
