const parseInlineStyle = require("./parseInlineStyle");
const INLINE_SPECIAL = ["*", "**", "~~", "__", "_"];

module.exports = function parseInline(opts) {
  let o = {
    str: opts.str,
    length: opts.length,
    index: opts.index || 0,
    children: []
  };

  let n = 0;

  while (o.str[o.index] === "#") {
    o.index += 1;
  }

  while (o.str[o.index] === "-") {
    o.index += 1;
  }

  if (/^(\s+|)[0-9]+\./.test(o.str)) {
    o.index += o.str.match(/^(\s+|)[0-9]+\./)[0].length;
  }

  while ([" "].indexOf(o.str[o.index]) > -1) {
    o.index += 1;
  }

  while (o.index < o.length) {
    if (INLINE_SPECIAL.indexOf(o.str.slice(o.index, o.index + 2)) > -1) {
      o.children.push(
        parseInlineStyle(
          Object.assign({}, o),
          o.str.slice(o.index, o.index + 2)
        )
      );

      o.index = (
        o.str.indexOf(
          INLINE_SPECIAL[INLINE_SPECIAL.indexOf(o.str.slice(o.index, o.index + 2))],
          o.index + 2
        ) + 1
      );
    } else if (INLINE_SPECIAL.indexOf(o.str.slice(o.index, o.index + 1)) > -1) {
      o.children.push(
        parseInlineStyle(
          Object.assign({}, o),
          o.str.slice(o.index, o.index + 1)
        )
      );

      o.index = (
        o.str.indexOf(
          INLINE_SPECIAL[INLINE_SPECIAL.indexOf(o.str.slice(o.index, o.index + 1))],
          o.index + 2
        )
      );
    } else {
      if (typeof o.children[n] === "object") {
        o.children.push("");
        n += 1;
      } else if (typeof o.children[n] === "undefined") {
        o.children[n] = "";
      }

      if (o.str[o.index] === "\\" && INLINE_SPECIAL.indexOf(o.str.slice(o.index + 1, o.index + 3)) > -1) {
        // Handle escape
        o.children[n] += o.str.slice(o.index + 1, o.index + 3);
        o.index += 3;
      } else {
        o.children[n] += o.str[o.index];
      }
    }

    n = o.children.length - 1;
    o.index = o.index + 1;
  }

  return o.children;
};