// Shared Perlin noise primitives used by glitch and fog components.

// ---------------------------------------------------------------------------
// Permutation table
// ---------------------------------------------------------------------------

function makePermutationTable(): Uint8Array {
  const PERM = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
  return PERM;
}

// ---------------------------------------------------------------------------
// Smoothstep fade  t³(6t² − 15t + 10)
// ---------------------------------------------------------------------------

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// ---------------------------------------------------------------------------
// 1-D Perlin noise (returns a factory — each call gets its own perm table)
// ---------------------------------------------------------------------------

export function makeNoise1D(): (x: number) => number {
  const PERM = makePermutationTable();

  function grad1d(hash: number, x: number): number {
    return (hash & 1) === 0 ? x : -x;
  }

  return function noise1d(x: number): number {
    const xi = Math.floor(x) & 255;
    const xf = x - Math.floor(x);
    const u = fade(xf);
    const a = grad1d(PERM[xi], xf);
    const b = grad1d(PERM[xi + 1], xf - 1);
    return 0.5 + 0.5 * (a + u * (b - a));
  };
}

// ---------------------------------------------------------------------------
// 2-D Perlin noise (returns an object with noise2d, fbm, warpedFbm)
// ---------------------------------------------------------------------------

const GRAD2 = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
];

export interface Noise2D {
  noise2d: (x: number, y: number) => number;
  fbm: (x: number, y: number) => number;
  warpedFbm: (x: number, y: number, t: number) => number;
}

export function makeNoise2D(): Noise2D {
  const PERM = makePermutationTable();

  function dot2(gv: number[], x: number, y: number): number {
    return gv[0] * x + gv[1] * y;
  }

  function noise2d(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);

    const aa = PERM[PERM[X] + Y] & 7;
    const ab = PERM[PERM[X] + Y + 1] & 7;
    const ba = PERM[PERM[X + 1] + Y] & 7;
    const bb = PERM[PERM[X + 1] + Y + 1] & 7;

    const x1 = dot2(GRAD2[aa], xf, yf);
    const x2 = dot2(GRAD2[ba], xf - 1, yf);
    const y1 = dot2(GRAD2[ab], xf, yf - 1);
    const y2 = dot2(GRAD2[bb], xf - 1, yf - 1);

    const la = x1 + u * (x2 - x1);
    const lb = y1 + u * (y2 - y1);
    return 0.5 + 0.5 * (la + v * (lb - la));
  }

  function fbm(x: number, y: number): number {
    let val = 0;
    let amp = 0.5;
    let freq = 1;
    for (let i = 0; i < 5; i++) {
      val += amp * noise2d(x * freq, y * freq);
      amp *= 0.5;
      freq *= 2.2;
    }
    return val;
  }

  function warpedFbm(x: number, y: number, t: number): number {
    const q0 = fbm(x + t * 0.4, y + t * 0.3);
    const q1 = fbm(x + 5.2 + t * 0.2, y + 1.3 - t * 0.35);
    return fbm(x + 2.0 * q0, y + 2.0 * q1);
  }

  return { noise2d, fbm, warpedFbm };
}

// ---------------------------------------------------------------------------
// Zalgo combining marks + random pick helper (used by glitch components)
// ---------------------------------------------------------------------------

export const ZALGO_UP: string[] = [];
export const ZALGO_DOWN: string[] = [];
for (let c = 0x0300; c <= 0x036f; c++) ZALGO_UP.push(String.fromCharCode(c));
for (let c = 0x0316; c <= 0x0333; c++) ZALGO_DOWN.push(String.fromCharCode(c));

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
