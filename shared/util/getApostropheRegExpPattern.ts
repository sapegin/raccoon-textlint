/**
 * Minimal RegExp escaping. RegExp.escape() escapes too many things, which makes
 * it difficult to build custom RegExps afterwards.
 */
function escapeRegExp(string: string) {
  return string.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

export function getApostropheRegExpPattern(string: string) {
  return escapeRegExp(string).replaceAll(/['’‘]/g, "['’‘]");
}
