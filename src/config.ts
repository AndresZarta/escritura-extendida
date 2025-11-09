// src/config.ts
export const SITE = {
  title: "escritura::expandida",
  tagline: "Un ensayo interdisciplinario sobre como pensar, escribir y programar una nueva literatura digital.",
};

// Base path for GitHub Pages deployment
// Must match the `base` value in astro.config.mjs
export const BASE_PATH = '/escritura-expandida';

// Helper to build paths with base
export function withBase(path: string): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${cleanPath}`;
}
