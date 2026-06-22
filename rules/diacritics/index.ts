import fs from 'node:fs';
import { createRequire } from 'node:module';
import { type TxtNode } from '@textlint/ast-node-types';
import {
  type TextlintFixableRuleModule,
  type TextlintRuleContext,
} from '@textlint/types';
import { matchCase } from '../../shared/util/matchCase.js';
import { stripJsonComments } from '../../shared/util/stripJsonComments.js';

export interface Options {
  // List of additional words: filename, npm module or an array of words
  words?: string | readonly string[];
}

const DEFAULT_OPTIONS: Options = {
  words: [],
};

const MARK_GROUPS = [
  "’'",
  'àâäåa',
  'éèêëe',
  'çc',
  'îíi',
  'ñn',
  'öo',
  'šs',
  'ûüu',
  'ÿy',
];

/**
 * Load JSON file, strip comments.
 *
 * TODO: Shall we move this to utils?
 */
function loadJson(modulePath: string) {
  // TODO: Should this be just path.join(cwd, modulepath)?
  const require = createRequire(import.meta.url);
  const resolvedModule = require.resolve(modulePath);
  const json = fs.readFileSync(resolvedModule, 'utf8');
  return JSON.parse(stripJsonComments(json)) as string[];
}

/**
 * Load all default words joined with additional words from a config file
 */
function getWords(words: string | readonly string[] = []) {
  const defaults = loadJson('./words.jsonc');
  const extras = typeof words === 'string' ? loadJson(words) : words;
  return [...defaults, ...extras];
}

/**
 * Replace all diacritics with RegExp patterns that match that character with or
 * without a diacritic mark: décor → d[éèêëe]cor
 */
export function getPattern(word: string) {
  return MARK_GROUPS.reduce((pattern, group) => {
    // Strip the last character which is a character without diacritic mark
    const groupPattern = `[${group.slice(0, Math.max(0, group.length - 1))}]`;
    return pattern.replaceAll(new RegExp(groupPattern, 'ig'), `[${group}]`);
  }, word);
}

/**
 * Get patterns from words list
 */
export function getPatterns(words: readonly string[]) {
  return words.map(getPattern);
}

/**
 * RegExp from list of patterns.
 *
 * For "résumé" it should match:
 * - resume
 * - résume
 * - résumé
 * - resumes
 * - Resume
 *
 * For "raison d'etre" it should match:
 * - raison d'etre
 * - raison d’etre
 * - raison d'être
 * - Raison d'être
 */
export function getRegExp(patterns: readonly string[]) {
  return new RegExp(`(\\b(?:${patterns.join('|')})\\b)`, 'ig');
}

/**
 * Return a correct word based on found incorrect word.
 * Keeps case and suffix of an original word.
 */
export function getReplacement(words: readonly string[], match: string) {
  for (const word of words) {
    const pattern = getPattern(word);
    if (!getRegExp([pattern]).test(match)) {
      continue;
    }

    const corrected = match.replace(new RegExp(`\\b${pattern}\\b`, 'i'), word);
    return matchCase(corrected, match);
  }

  return false;
}

function reporter(
  // The Textlint context isn't deeply readonly and we only read from it
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types
  context: TextlintRuleContext,
  userOptions: Readonly<Partial<Options>> = {}
) {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };
  const words = getWords(options.words);

  // Regexp for all possible mistakes
  const regExp = getRegExp(getPatterns(words));

  const { Syntax, RuleError } = context;
  return {
    [Syntax.Str](node: TxtNode) {
      const text = context.getSource(node);

      let match;
      while ((match = regExp.exec(text))) {
        const matched = match[0];
        const replacement = getReplacement(words, matched);

        if (
          // Skip correct spelling
          matched === replacement ||
          // Normally this shouldn't happen:
          // all matched words should have replacements
          replacement === false
        ) {
          continue;
        }

        const index = match.index;
        const fix = context.fixer.replaceTextRange(
          [index, index + matched.length],
          replacement
        );
        const message = `Incorrect usage of the word: “${matched}”, use “${replacement}” instead`;
        context.report(node, new RuleError(message, { index, fix }));
      }
    },
  };
}

const rule: TextlintFixableRuleModule<Options> = {
  linter: reporter,
  fixer: reporter,
};

export default rule;
