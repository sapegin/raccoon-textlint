Monorepo of Textlint rules. One workspace per rule under `rules/<id>/`.

## Rule contract

Each rule MUST:

- have an `index.ts` exporting an `TextlintFixableRuleModule`
- have a `package.json` with `name` of `textlint-rule-<id>`
- bundle to `index.js` via `npm run build`

## Commands

```sh
npm install              # root: install all workspaces
npm run build            # build every rule
npm test                 # lint + build + workspace tests
npm run format           # format code
```

## When adding a new extension

1. `mkdir extensions/textlint-rule-<id>`, and copy the structure from an existing extension.
2. Update `package.json` (`name`, `displayName`, `description`).
3. Add the extension to the list in [Readme.md](Readme.md).
4. Run `npm install && npm run build` to verify it bundles.
