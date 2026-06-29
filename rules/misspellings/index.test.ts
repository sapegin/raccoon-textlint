import TextLintTester from 'textlint-tester';
import { describe, expect, test } from 'vitest';
import rule, { getDictionary, getRegExp, getReplacement } from './index';

const tester = new TextLintTester();

describe(getDictionary, () => {
  test('should load default dictionary', () => {
    const result = getDictionary(true, {}, []);
    expect(result).toContainEqual(['abandonned', ['abandoned']]);
  });

  test('should use user dictionary', () => {
    const result = getDictionary(false, { teh: ['the'] }, []);
    expect(result).not.toContainEqual(['abandonned', ['abandoned']]);
    expect(result).toContainEqual(['teh', ['the']]);
  });

  test('should load user dictionary from a file', () => {
    const result = getDictionary(false, './test/dict.jsonc', []);
    expect(result).toContainEqual(['teh', ['the']]);
  });

  test('should remove excluded words', () => {
    const result = getDictionary(true, { teh: ['the'] }, [
      'abandonned',
      'teh',
    ]);
    expect(result).not.toContainEqual(['abandonned', ['abandoned']]);
    expect(result).not.toContainEqual(['teh', ['the']]);
  });
});

describe(getRegExp, () => {
  test('should match a misspelling as a full word', () => {
    const result = getRegExp(['teh']).exec('I saw teh word');
    expect(result?.[1]).toBe('teh');
  });

  test('should not match a misspelling in the middle of a word', () => {
    const result = getRegExp(['teh']).exec('I saw atehword');
    expect(result).toBeNull();
  });

  test('should not match a misspelling in a hyphenated word', () => {
    const result = getRegExp(['teh']).exec('I saw teh-word');
    expect(result).toBeNull();
  });

  test('should not match a misspelling in a file name', () => {
    const result = getRegExp(['teh']).exec('teh.md');
    expect(result).toBeNull();
  });

  test('should match a misspelling with any kind of apostrophe', () => {
    const result = "foo dosen't dosen’t dosen‘t bar".match(
      getRegExp(["dosen't"])
    );
    expect(result).toStrictEqual([" dosen't", ' dosen’t', ' dosen‘t']);
  });
});

describe(getReplacement, () => {
  test('should return a replacement when there is one suggestion', () => {
    const result = getReplacement(['the'], 'teh');
    expect(result).toBe('the');
  });

  test('should preserve first letter case', () => {
    const result = getReplacement(['abandoned'], 'Abandonned');
    expect(result).toBe('Abandoned');
  });

  test('should not return a replacement when there are multiple suggestions', () => {
    const result = getReplacement(['achieve', 'archive'], 'achive');
    expect(result).toBeUndefined();
  });
});

test('misspellings', () => {
  tester.run('misspellings', rule, {
    valid: [
      {
        text: 'A correctly spelled word',
      },
      {
        // Should skip code examples
        text: 'Do not fix `teh` in code',
      },
      {
        // Should skip URLs
        text: 'Do not fix [link](https://example.com/teh)',
      },
      {
        // Should not warn when a misspelling is used as a part of another word
        text: 'The footehword is made up',
      },
      {
        // Should not warn when a misspelling is used as a part of a hyphenated word
        text: 'The teh-word is made up',
      },
      {
        // Should not warn about file names
        text: 'Open teh.md',
      },
    ],
    invalid: [
      {
        text: 'This is teh word',
        output: 'This is the word',
        errors: [
          {
            message: 'Common misspelling: “teh”, use “the” instead',
          },
        ],
      },
      {
        text: 'Abandonned houses',
        output: 'Abandoned houses',
        errors: [
          {
            message: 'Common misspelling: “Abandonned”, use “abandoned” instead',
          },
        ],
      },
      {
        text: "That dosen't work",
        output: "That doesn't work",
        errors: [
          {
            message: "Common misspelling: “dosen't”, use “doesn't” instead",
          },
        ],
      },
      {
        text: 'This is achive',
        output: 'This is achive',
        errors: [
          {
            message:
              'Common misspelling: “achive”, use “achieve”, “archive” instead',
          },
        ],
      },
    ],
  });

  tester.run(
    'textlint-rule-misspellings',
    {
      rules: [
        {
          ruleId: 'misspellings',
          rule,
          options: {
            defaultDictionary: false,
            dictionary: {
              teh: ['the'],
            },
          },
        },
      ],
    },
    {
      valid: [
        {
          text: 'Abandonned is ignored without default dictionary',
        },
      ],
      invalid: [
        {
          text: 'This is teh word',
          output: 'This is the word',
          errors: [
            {
              message: 'Common misspelling: “teh”, use “the” instead',
            },
          ],
        },
      ],
    }
  );
});
