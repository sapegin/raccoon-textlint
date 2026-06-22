import TextLintTester from 'textlint-tester';
import { test } from 'vitest';
import rule, { getReplacement } from './index';

const tester = new TextLintTester();

// oxlint-disable-next-line vitest/warn-todo
test.todo(getReplacement);

test('quotes', () => {
  tester.run('quotes', rule, {
    valid: [
      'the “good” one',
      'the “very good” one',
      // TODO: Not supported yet
      // 'personal best: 00\'03"48',
      // 'latitude: 49° 53\' 08"',
    ],
    invalid: [
      {
        text: 'the "good" one',
        output: 'the “good” one',
        errors: [
          {
            message: 'Incorrect quote used: `"good"`, use `“good”` instead',
          },
        ],
      },
      {
        text: 'the "very good" one',
        output: 'the “very good” one',
        errors: [
          {
            message: 'Incorrect quote used: `"very`, use `“very` instead',
          },
          {
            message: 'Incorrect quote used: `good"`, use `good”` instead',
          },
        ],
      },
    ],
  });
});
