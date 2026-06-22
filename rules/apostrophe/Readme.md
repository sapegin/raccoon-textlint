# textlint-rule-apostrophe

[![textlint fixable rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/)

[Textlint](https://github.com/textlint/textlint) rule to check and fix correct apostrophe usage: replace `'` and `‘` with `’`.

![textlint-rule-apostrophe screenshot](https://d3vv6lp55qjaqc.cloudfront.net/items/273Q363N452m0x0b393E/apostrophe.png)

[![Washing your code. A book on clean code for frontend developers](https://sapegin.me/images/washing-code-github.jpg)](https://sapegin.me/book/)

## Installation

```shell
npm install textlint-rule-apostrophe
```

Then enable the rule in your `.textlintrc`:

```js
{
  "rules": {
    "apostrophe": true
  }
}
```

Read more about [configuring textlint](https://github.com/textlint/textlint/blob/master/docs/configuring.md).

## Usage

```shell
textlint --fix --rule apostrophe Readme.md
```

## Contributing

Bug fixes are welcome, but not new features.

## Sponsoring

This software has been developed with lots of coffee, buy me one more cup to keep it going.

<a href="https://www.buymeacoffee.com/sapegin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" height="51" width="217" ></a>

## Authors and license

[Artem Sapegin](https://sapegin.me) and [contributors](https://github.com/sapegin/raccoon-textlint/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
