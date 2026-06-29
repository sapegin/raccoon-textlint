# textlint-rule-misspellings

[![textlint fixable rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/)

[Textlint](https://github.com/textlint/textlint) rule to check and fix common misspellings in English.

**This is a reimplementation of [textlint-rule-common-misspellings](https://github.com/io-monad/textlint-rule-common-misspellings) for internal usage.**

For example:

- accomodate → accommodate
- adress → address
- calender → calendar
- dosen’t → doesn’t
- teh → the

(You can disable some words or add your own.)

[![Washing your code. A book on clean code for frontend developers](https://sapegin.me/images/washing-code-github.jpg)](https://sapegin.me/book/)

## Installation

```shell
npm install textlint-rule-misspellings
```

## Usage

```shell
textlint --fix --rule misspellings Readme.md
```

## Configuration

You can configure the rule in your `.textlintrc`:

```js
{
  "rules": {
    "misspellings": {
      // Your options here
    }
  }
}
```

Read more about [configuring textlint](https://github.com/textlint/textlint/blob/master/docs/configuring.md).

### `defaultDictionary` (default: `true`)

Whether to load the [default dictionary](./dict.jsonc). Example:

```js
{
  "rules": {
    "misspellings": {
      // Don't load default dictionary
      "defaultDictionary": false,
    }
  }
}
```

### `skip` (default `['BlockQuote']`)

Syntax elements to skip. By default skips blockquotes. Example:

```js
{
  "rules": {
    "misspellings": {
      // Don't check misspellings inside links
      "skip": ["Link"],
    }
  }
}
```

See [all available element types](https://github.com/textlint/textlint/blob/master/packages/%40textlint/ast-node-types/src/ASTNodeTypes.ts).

### `dictionary`

Additional misspellings.

Could be a dictionary object:

```js
{
  "rules": {
    "misspellings": {
      "dictionary": {
        "teh": ["the"],
        "achive": ["achieve", "archive"]
      }
    }
  }
}
```

Or a path to a JSONC file:

```js
{
  "rules": {
    "misspellings": {
      // Load misspellings from a file
      "dictionary": "~/misspellings.jsonc"
    }
  }
}
```

The dictionary format is `Record<string, string[]>`: each key is a misspelling, and the value is a list of suggestions. The rule can autofix entries with a single suggestion. Entries with multiple suggestions are reported without a fix.

Check out [the default dictionary](./dict.jsonc).

### `exclude`

If you don’t like some of [the default misspellings](./dict.jsonc), you can _exclude_ them:

```js
{
  "rules": {
    "misspellings": {
      // Excludes misspellings
      "exclude": [
        "teh",
        "achive"
      ]
    }
  }
}
```

## Tips & tricks

Use [textlint-filter-rule-comments](https://github.com/textlint/textlint-filter-rule-comments) to disable misspellings check for particular paragraphs:

```markdown
<!-- textlint-disable misspellings -->

Teh typo stays here.

<!-- textlint-enable -->
```

## Contributing

Bug fixes are welcome, but not new features.

## Sponsoring

This software has been developed with lots of coffee, buy me one more cup to keep it going.

<a href="https://www.buymeacoffee.com/sapegin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" height="51" width="217" ></a>

## Authors and license

[Artem Sapegin](https://sapegin.me) and [contributors](https://github.com/sapegin/raccoon-textlint/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
