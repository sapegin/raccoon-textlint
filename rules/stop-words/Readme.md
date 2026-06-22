# textlint-rule-stop-words

[![textlint fixable rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/) [![npm](https://img.shields.io/npm/v/textlint-rule-stop-words.svg)](https://www.npmjs.com/package/textlint-rule-stop-words)

[textlint](https://github.com/textlint/textlint) rule to find filler words, buzzwords, and clichés — [2000+ words and phrases](./dict.txt) in English.

For example:

- and etc.
- multifaceted
- rich tapestry
- the month of
- thick as a brick
- today in the digital age
- utilize

(You can disable some words or add your own.)

![](https://d3vv6lp55qjaqc.cloudfront.net/items/2P3W3w0d1N0K421H333m/textlint-rule-stop-words.png)

[![Washing your code. A book on clean code for frontend developers](https://sapegin.me/images/washing-code-github.jpg)](https://sapegin.me/book/)

## Installation

```shell
npm install textlint-rule-stop-words
```

## Usage

```shell
textlint --fix --rule stop-words Readme.md
```

## Configuration

You can configure the rule in your `.textlintrc`:

```js
{
  "rules": {
    "stop-words": {
      // Your options here
    }
  }
}
```

Read more about [configuring textlint](https://github.com/textlint/textlint/blob/master/docs/configuring.md).

### `defaultWords` (default: `true`)

Whether to load the [default dictionary](./dict.txt). Example:

```js
{
  "rules": {
    "stop-words": {
      // Don't load default dictionary
      "defaultWords": false,
    }
  }
}
```

### `skip` (default `['BlockQuote']`)

Syntax elements to skip. By default skips blockquotes. Example:

```js
{
  "rules": {
    "stop-words": {
      // Don't check terms inside links
      "skip": ["Link"],
    }
  }
}
```

See [all available element types](https://github.com/textlint/textlint/blob/master/packages/%40textlint/ast-node-types/src/ASTNodeTypes.ts).

### `words`

Additional words.

Could be an array of words:

```js
{
  "rules": {
    "stop-words": {
      // List of words
      "words": [
        // Exact words
        ["etc."],
        ["you can"],
        // With a replacement
        ["blacklist", "denylist"]
      ],
    }
  }
}
```

A path to a text file:

```js
{
  "rules": {
    "stop-words": {
      // Load words from a file
      "words": "~/stop-words.txt"
    }
  }
}
```

Check out [the default dictionary](./dict.txt).

### `exclude`

If you don’t like some of [the default words](./dict.txt), you can _exclude_ them. For example, to exclude these entries:

```txt
// dict.txt
utilize > use
period of time
```

You need to copy the exact entry (for words with replacement, just the first element) to the `exclude` option of the `stop-words` rule in your Textlint config:

```js
{
  "rules": {
    "stop-words": {
      // Excludes terms
      "exclude": [
        "utilize",
        "period of time"
      ]
    }
  }
}
```

## Tips & tricks

Use [textlint-filter-rule-comments](https://github.com/textlint/textlint-filter-rule-comments) to disable stop-words check for particular paragraphs:

```markdown
<!-- textlint-disable stop-words -->

Oh my javascript!

<!-- textlint-enable -->
```

## Sources

- Grammar & Writing for Creators
- [297 Flabby Words and Phrases That Rob Your Writing of All Its Power](https://smartblogger.com/weak-writing/)
- [no-cliches](https://github.com/dunckr/no-cliches/)
- [fillers](https://github.com/wooorm/fillers/)
- [hedges](https://github.com/wooorm/hedges/)
- [weasels](https://github.com/wooorm/weasels/)
- [buzzwords](https://github.com/wooorm/buzzwords/)
- [retext-simplify](https://github.com/wooorm/retext-simplify/)

## Contributing

Bug fixes are welcome, but not new features.

## Sponsoring

This software has been developed with lots of coffee, buy me one more cup to keep it going.

<a href="https://www.buymeacoffee.com/sapegin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" height="51" width="217" ></a>

## Authors and license

[Artem Sapegin](https://sapegin.me) and [contributors](https://github.com/sapegin/raccoon-textlint/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
