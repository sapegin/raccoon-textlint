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
import { stripJsonComments } from '../../shared/util/stripJsonComments.js';

type Dictionary = Readonly<Record<string, readonly string[]>>;

export interface Options {
  /** List of additional misspellings: filename, npm module or a dictionary. */
  dictionary: string | Dictionary;
  exclude: readonly string[];
  defaultDictionary: boolean;
  skip: readonly TxtNodeType[];
}

const DEFAULT_OPTIONS: Options = {
  dictionary: {},
  exclude: [],
  defaultDictionary: true,
  skip: ['BlockQuote'],
};

function loadJson(modulePath: string) {
  const require = createRequire(import.meta.url);
  const resolvedModule = require.resolve(modulePath);
  const json = fs.readFileSync(resolvedModule, 'utf8');
  return JSON.parse(stripJsonComments(json)) as Dictionary;
}

export function getDictionary(
  defaultDictionary: boolean,
  dictionary: string | Dictionary,
  exclude: readonly string[]
) {
  const defaults = defaultDictionary ? loadJson('./dict.jsonc') : {};
  const extras =
    typeof dictionary === 'string' ? loadJson(dictionary) : dictionary;
  const excludedSet = new Set(exclude.map((word) => word.toLowerCase()));

  return Object.entries({ ...defaults, ...extras }).filter(
    ([word]) => excludedSet.has(word.toLowerCase()) === false
  );
}

/** RegExp to match exact misspellings. */
export function getRegExp(words: readonly string[]) {
  if (words.length === 0) {
    // Impossible match for an empty dictionary.
    return /$a/gi;
  }

  const wordPattern = words.map(getApostropheRegExpPattern).join('|');
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
    'gi'
  );
}

export function getReplacement(
  replacements: readonly string[],
  matched: string
) {
  if (replacements.length !== 1) {
    return undefined;
  }

  return matchCase(replacements[0], matched);
}

function getMessage(matched: string, replacements: readonly string[]) {
  const suggestions = replacements.map((word) => `“${word}”`).join(', ');
  return `Common misspelling: “${matched}”, use ${suggestions} instead`;
}

function isWordEdge(source: string, index: number) {
  return /[-.\w]/.test(source.charAt(index));
}

function reporter(
  // The Textlint context isn't deeply readonly and we only read from it
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types
  context: TextlintRuleContext,
  userOptions: Readonly<Partial<Options>> = {}
) {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };
  const dictionary = new Map(
    getDictionary(
      options.defaultDictionary,
      options.dictionary,
      options.exclude
    ).map(([word, replacements]) => [word.toLowerCase(), replacements])
  );
  const regExp = getRegExp([...dictionary.keys()]);

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

      const fullText = context.getSource();
      const text = context.getSource(node);

      let match: RegExpExecArray | null;
      while ((match = regExp.exec(text))) {
        const matched = match[1];
        const replacements = dictionary.get(matched.toLowerCase());

        if (replacements === undefined) {
          continue;
        }

        const index = match.index + match[0].length - matched.length;
        const absoluteIndex = node.range[0] + index;
        if (
          isWordEdge(fullText, absoluteIndex - 1) ||
          isWordEdge(fullText, absoluteIndex + matched.length)
        ) {
          continue;
        }

        const replacement = getReplacement(replacements, matched);
        const fix =
          replacement === undefined
            ? undefined
            : context.fixer.replaceTextRange(
                [index, index + matched.length],
                replacement
              );
        const message = getMessage(matched, replacements);
        context.report(node, new RuleError(message, { index, fix }));
      }
    },
  };
}

const rule: TextlintFixableRuleModule<Partial<Options>> = {
  linter: reporter,
  fixer: reporter,
};

export default rule;
