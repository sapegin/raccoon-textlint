import fs from 'node:fs';
import { createRequire } from 'node:module';
import { type TxtNode, type TxtNodeType } from '@textlint/ast-node-types';
import {
  type TextlintFixableRuleModule,
  type TextlintRuleContext,
} from '@textlint/types';
import { RuleHelper } from 'textlint-rule-helper';
import { getApostropheRegExpPattern } from '../../shared/util/getApostropheRegExpPattern.js';
import { matchCase } from '../../shared/util/matchCase.js';

type Rule = readonly string[];

export interface Options {
  /** List of additional words: filename, npm module or an array of words. */
  words: string | readonly Rule[];
  exclude: readonly string[];
  defaultWords: boolean;
  skip: readonly TxtNodeType[];
}

const DEFAULT_OPTIONS: Options = {
  words: [],
  exclude: [],
  defaultWords: true,
  skip: ['BlockQuote'],
};

function splitLines(text: string) {
  return text.split(/\r?\n/);
}

function reporter(
  // The Textlint context isn't deeply readonly and we only read from it
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types
  context: TextlintRuleContext,
  userOptions: Readonly<Partial<Options>> = {}
) {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };
  const rules = getDict(options.defaultWords, options.words, options.exclude);

  const helper = new RuleHelper(context);
  const { Syntax, RuleError } = context;
  return {
    [Syntax.Str](node: TxtNode) {
      if (
        helper.isChildNode(
          node,
          options.skip.map((rule) => Syntax[rule])
        )
      ) {
        return;
      }

      const text = context.getSource(node);

      for (const [word, alternative] of rules) {
        const regExp = getRegExp(word);

        let match;

        while ((match = regExp.exec(text))) {
          const index = match.index;
          const [matched, matchedWord] = match;

          if (alternative) {
            if (alternative !== matchedWord) {
              const replacement = matched.replace(
                matchedWord,
                matchCase(alternative, matchedWord)
              );
              const fix = context.fixer.replaceTextRange(
                [index, index + matched.length],
                replacement
              );
              const message = `Avoid using “${matchedWord}”, use “${alternative}” instead`;
              context.report(node, new RuleError(message, { index, fix }));
            }
          } else {
            const message = `Avoid using “${matched.trim()}”`;
            context.report(node, new RuleError(message, { index }));
          }
        }
      }
    },
  };
}

function getDict(
  defaultWords: boolean,
  extraWords: string | readonly Rule[],
  excludedWords: readonly (string | Rule)[]
) {
  const defaults = defaultWords ? loadDict('./dict.txt') : [];
  const extras =
    typeof extraWords === 'string' ? loadDict(extraWords) : extraWords;
  return filterDict([...defaults, ...extras], excludedWords);
}

function loadDict(filepath: string) {
  const require = createRequire(import.meta.url);
  const absolutePath = require.resolve(filepath);
  return parseDict(fs.readFileSync(absolutePath, 'utf8'));
}

export function parseDict(contents: string) {
  return splitLines(contents)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.split(/\s*>\s*/));
}

export function filterDict(
  rules: readonly Rule[],
  excludedWords: readonly (string | Rule)[]
) {
  const excludedSet = new Set(
    excludedWords.map((word) => (Array.isArray(word) ? word[0] : word))
  );
  return rules.filter((rule) => excludedSet.has(rule[0]) === false);
}

/** RegExp to match exact word */
export function getRegExp(word: string) {
  const wordPattern = getApostropheRegExpPattern(word);
  const punctuations = [
    String.raw`\.`,
    ',',
    ':',
    ';',
    String.raw`\?`,
    '!',
    '…',
  ];
  const punctuationsRegExp = punctuations.map(
    (punctuation) => `${punctuation} |${punctuation}$`
  );
  return new RegExp(
    `(?:^|[^-\\w])(${wordPattern}(?= |$|${punctuationsRegExp.join('|')}))`,
    'ig'
  );
}

const rule: TextlintFixableRuleModule<Partial<Options>> = {
  linter: reporter,
  fixer: reporter,
};

export default rule;
