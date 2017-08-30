const INLINE_SPECIAL = ["*", "**", "~~", "__", "_"];

const MATCH_LINK = require("./constants").MATCH_LINK;
const MATCH_PICTURE = require("./constants").MATCH_PICTURE;
const MATCH_RLINK = require("./constants").MATCH_RLINK;
const MATCH_STRIKETHROUGH = require("./constants").MATCH_STRIKETHROUGH;
const MATCH_INLINE_CODE = require("./constants").MATCH_INLINE_CODE;

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

function parseReference(str) {
  const match = str.match(MATCH_RLINK);
  return {
    type: "rlink",
    href: match[2].toLowerCase(),
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

function parseEmAndStrong(o) {
  let i = o.index;
  let end = "";
  let isValid;

  while (o.str[o.index] === "*") {
    end += o.str[o.index];
    o.index += 1;
  }

  while (o.str[o.index] && !isValid) {
    o.index += 1;
    isValid = o.str.substring(o.index, o.index + end.length) === end;
  }

  o.index += end.length - 1;

  return isValid
    ? mixInlineStyles(end.length % 2
      ? {
        type: "emphasis",
        children: [o.str.substring(i + 1, o.index)]
      }
      : {
        type: "strong",
        children: [o.str.substring(i + 2, o.index - 1)]
      }
    )
    : o.str.slice(i);
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
  let t;

  if (/^(\s+|)[0-9]+\./.test(o.str)) {
    // Ordered list
    o.index += o.str.match(/^(\s+|)[0-9]+\./)[0].length;
  } else if (/^(\s+|)([-]{3}|[_]{3}|[*]{3})/.test(o.str)) {
    // Horizontal rule
    o.index += o.str.match(/^(\s+|)([-]{3}|[_]{3}|[*]{3})/)[0].length;
  } else if (/^(\s+|)([#]+)/.test(o.str)) {
    // Headings
    o.index += o.str.match(/^(?:\s+|)([#]+)/)[1].length;
  } else if (/^(\s+|)(\*|-|\+)\s/.test(o.str)) {
    // List items
    o.index += o.str.match(/(\s+|)(\*|-|\+)\s/)[0].length;
  }

  if (
    o.str[o.index] === ">") {
    o.index += 1;
  }

  while ([" "].indexOf(o.str[o.index]) > -1) {
    o.index += 1;
  }

  while (o.index < o.length) {
    s = o.str.slice(o.index);
    if (s[0] === "*") {
      o.children.push(
        parseEmAndStrong(o)
      );

      t = o.children.slice(-2);

      if (typeof t[0] === "string" &&
          typeof t[1] === "string"
      ) {
        o.children.splice(
          o.children.length - 2,
          2,
          t[0] + t[1]
        );
      }
    } else if (MATCH_STRIKETHROUGH.test(s)) {
      o.children.push(mixInlineStyles({
        type: "strikethrough",
        children: [ s.match(MATCH_STRIKETHROUGH)[1] ]
      }));

      o.index += s.match(MATCH_STRIKETHROUGH)[0].length - 1;
    } else if (MATCH_PICTURE.test(s)) {
      o.children.push(parsePicture(s));
      o.index += s.match(MATCH_PICTURE)[0].length - 1;
    } else if (MATCH_LINK.test(s)) {
      // Links
      o.children.push(parseAnchor(s));
      o.index += s.match(MATCH_LINK)[0].length - 1;
    } else if (MATCH_RLINK.test(s)) {
      // References
      o.children.push(parseReference(s));
      o.index += s.match(MATCH_RLINK)[0].length - 1;
    } else if (MATCH_INLINE_CODE.test(s)) {
      // Code
      o.children.push({
        type: "inline-code",
        children: [ s.match(MATCH_INLINE_CODE)[1] ]
      });
      o.index += s.match(MATCH_INLINE_CODE)[0].length - 1;
    } else {
      if (typeof o.children[n] === "object") {
        o.children.push("");
        n += 1;
      } else if (typeof o.children[n] === "undefined") {
        o.children[n] = "";
      }

      t = o.str.slice(o.index + 1, o.index + 3);

      if (o.str[o.index] === "\\" && INLINE_SPECIAL.indexOf(t) > -1) {
        // Handle escape
        o.children[n] += t;
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