export function upperFirst(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function matchCase(clone: string, original: string) {
  return upperFirst(original) === original ? upperFirst(clone) : clone;
}
