import { describe, expect, test } from 'vitest';
import { stripJsonComments } from './stripJsonComments.js';

describe(stripJsonComments, () => {
  test('removes block comments', () => {
    const result = stripJsonComments('["one", /* comment */ "two"]');

    expect(result).toBe('["one",  "two"]');
  });

  test('removes line comments', () => {
    const result = stripJsonComments('["one",\n// comment\n"two"]');

    expect(result).toBe('["one",\n\n"two"]');
  });

  test('keeps URLs', () => {
    const result = stripJsonComments('"https://example.com/path"');

    expect(result).toBe('"https://example.com/path"');
  });
});
