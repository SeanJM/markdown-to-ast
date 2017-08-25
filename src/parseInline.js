const INLINE_SPECIAL = ["*", "**", "~~", "__", "_"];

const MATCH_LINK = require("./constants").MATCH_LINK;
const MATCH_PICTURE = require("./constants").MATCH_PICTURE;
const MATCH_STRIKETHROUGH = require("./constants").MATCH_STRIKETHROUGH;
const MATCH_EMPHASIS = require("./constants").MATCH_EMPHASIS;
const MATCH_STRONG = require("./constants").MATCH_STRONG;

function parseAnchor(str) {
  const match = str.match(MATCH_LINK);
  return {
    type: "a",
    href: match[2],
    children: parseInline({
      index: 0,
      str: match[1],
      length: match[1].length,
    })
  };
}

function parsePicture(str) {
  const match = str.match(MATCH_PICTURE);
  return {
    type: "img",
    src: match[2],
    alt: match[1]
  };
}

function parseInline(opts) {
  let o = {
    str: opts.str,
    length: opts.length,
    index: opts.index || 0,
    children: []
  };

  let n = 0;
  let s;

  if (/^(\s+|)[0-9]+\./.test(o.str)) {
    // Ordered list
    o.index += o.str.match(/^(\s+|)[0-9]+\./)[0].length;
  } else if (/^(\s+|)([-]{3}|[_]{3}|[*]{3})/.test(o.str)) {
    // Horizontal rule
    o.index += o.str.match(/^(\s+|)([-]{3}|[_]{3}|[*]{3})/)[0].length;
  } else if (/^(\s+|)([#]+)/.test(o.str)) {
    // Headings
    o.index += o.str.match(/^(?:\s+|)([#]+)/)[1].length;
  }

  if (
    o.str[o.index] === "-" ||
    o.str[o.index] === "*" ||
    o.str[o.index] === "+" ||
    o.str[o.index] === ">") {
    o.index += 1;
  }

  while ([" "].indexOf(o.str[o.index]) > -1) {
    o.index += 1;
  }

  while (o.index < o.length) {
    s = o.str.slice(o.index);
    if (MATCH_STRONG.test(s)) {
      o.children.push(mixInlineStyles({
        type: "strong",
        children: [ s.match(MATCH_STRONG)[1] ]
      }));

      o.index += s.match(MATCH_STRONG)[0].length - 1;
    } else if (MATCH_STRIKETHROUGH.test(s)) {
      o.children.push(mixInlineStyles({
        type: "strikethrough",
        children: [ s.match(MATCH_STRIKETHROUGH)[1] ]
      }));

      o.index += s.match(MATCH_STRIKETHROUGH)[0].length - 1;
    } else if (MATCH_EMPHASIS.test(s)) {
      o.children.push(mixInlineStyles({
        type: "emphasis",
        children: [ s.match(MATCH_EMPHASIS)[1] ]
      }));

      o.index += s.match(MATCH_EMPHASIS)[0].length - 1;
    } else if (MATCH_PICTURE.test(s)) {
      o.children.push(parsePicture(s));
      o.index += s.match(MATCH_PICTURE)[0].length - 1;
    } else if (MATCH_LINK.test(s)) {
      // Links
      o.children.push(parseAnchor(s));
      o.index += s.match(MATCH_LINK)[0].length - 1;
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
}

function mixInlineStyles(props) {
  return {
    type: props.type,
    children: parseInline({
      index: 0,
      str: props.children[0],
      length: props.children[0].length,
    })
  };
}

module.exports = parseInline;