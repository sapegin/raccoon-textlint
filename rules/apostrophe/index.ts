import { type TxtNode } from '@textlint/ast-node-types';
import {
  type TextlintFixableRuleModule,
  type TextlintRuleContext,
} from '@textlint/types';

const evilApostropheRegExp = /(?:(?<=\s)|[^\d\W])+['‘](?:\w['‘])?\w*/g;
const evilApostrophe = /['‘]/g;
const goodApostrophe = '’';

export function getReplacement(text: string) {
  return text.replaceAll(evilApostrophe, goodApostrophe);
}

function reporter(
  // The Textlint context isn't deeply readonly and we only read from it
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types
  context: TextlintRuleContext
) {
  const { Syntax, RuleError } = context;
  return {
    [Syntax.Str](node: TxtNode) {
      const text = context.getSource(node);

      let match;

      while ((match = evilApostropheRegExp.exec(text))) {
        const index = match.index;
        const matched = match[0];
        const replacement = getReplacement(matched);
        const fix = context.fixer.replaceTextRange(
          [index, index + matched.length],
          replacement
        );
        const message = `Incorrect usage of an apostrophe: “${matched}”, use “${replacement}” instead`;
        context.report(
          node,
          new RuleError(message, {
            index,
            fix,
          })
        );
      }
    },
  };
}

const rule: TextlintFixableRuleModule = {
  linter: reporter,
  fixer: reporter,
};

export default rule;
