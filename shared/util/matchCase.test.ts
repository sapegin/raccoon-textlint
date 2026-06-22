import { describe, expect, test } from 'vitest';
import { matchCase } from './matchCase.js';

describe(matchCase, () => {
  test('capitalizes the clone when the original is capitalized', () => {
    const result = matchCase('crêpe', 'Crepe');

    expect(result).toBe('Crêpe');
  });

  test('keeps the clone unchanged when the original is lowercase', () => {
    const result = matchCase('crêpe', 'crepe');

    expect(result).toBe('crêpe');
  });
});
