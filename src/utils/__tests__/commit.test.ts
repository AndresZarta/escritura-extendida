import { describe, it, expect } from 'vitest';
import { commitUrl } from '../commit';
import { REPO_URL } from '../../config';

describe('commitUrl', () => {
  it('retorna la URL del repositorio cuando no se proporciona sha', () => {
    expect(commitUrl()).toBe(REPO_URL);
  });

  it('retorna la URL del commit cuando se proporciona sha', () => {
    const sha = 'abc1234';
    expect(commitUrl(sha)).toBe(`${REPO_URL}/commit/${sha}`);
  });
});
