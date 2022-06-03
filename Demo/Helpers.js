const yn = value => value && `yep` || `nope`;

export {JsonReplacer, Logger, repeat, centerTitle, yn};

function repeat(chars, n) {
  return new Array(n).join(chars);
}

function centerTitle(title, width, betweenChr = " ") {
  title  = `[${title}]`;
  const n = Math.ceil((width - title.length)/2);
  let rv = `${repeat(betweenChr, n)}${title}${repeat(betweenChr, n)}`;
  return rv.length > width ? rv.slice(0, width) : rv + repeat(betweenChr, width-rv.length)
}

function JsonReplacer(k, v) {
  if (v instanceof RegExp || v instanceof Function) {
    return v.toString();
  }
  return v;
}

function Logger() {
  const report =
    document.querySelector("#report") ||
    document.body.insertAdjacentElement(
      "beforeend",
      Object.assign(document.createElement("pre"), { id: "report" })
    );
  
  return (...args) =>
    args.forEach(
      arg => report.insertAdjacentHTML(`beforeend`, `<div class="logEntry">${
        arg instanceof Object ? `<code>${JSON.stringify(arg, null, 2)}</code>` : arg}</div>`)
    );
}