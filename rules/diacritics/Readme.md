# textlint-rule-diacritics

[![textlint fixable rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/) [![npm](https://img.shields.io/npm/v/textlint-rule-diacritics.svg)](https://www.npmjs.com/package/textlint-rule-diacritics)

[Textlint](https://github.com/textlint/textlint) rule to check and fix the correct usage of diacritics.

For example:

- creme brulee → crème brûlée
- deja vu → déjà vu
- senorita → señorita
- doppelganger → doppelgänger

(You can add your own words too.)

![](https://d3vv6lp55qjaqc.cloudfront.net/items/2U143Z0i3p3G0i1Q0i1D/textlint-rule-diacritics.png)

[![Washing your code. A book on clean code for frontend developers](https://sapegin.me/images/washing-code-github.jpg)](https://sapegin.me/book/)

## Installation

```shell
npm install textlint-rule-diacritics
```

## Usage

```shell
textlint --fix --rule diacritics Readme.md
```

## Configuration

You can configure the rule in your `.textlintrc`:

```js
{
  "rules": {
    "diacritics": {
      // List of additional words
      "words": [
        "tâmia",
      ],
      // OR load words from a file
      "words": "~/words.jsonc",
      // OR load words from npm
      "words": "@johnsmith/words"
    }
  }
}
```

Check [the default diacritics list](./words.jsonc). Read more about [configuring textlint](https://github.com/textlint/textlint/blob/master/docs/configuring.md).

## Contributing

Bug fixes are welcome, but not new features.

## Sponsoring

This software has been developed with lots of coffee, buy me one more cup to keep it going.

<a href="https://www.buymeacoffee.com/sapegin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" height="51" width="217" ></a>

## Authors and license

[Artem Sapegin](https://sapegin.me) and [contributors](https://github.com/sapegin/raccoon-textlint/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
