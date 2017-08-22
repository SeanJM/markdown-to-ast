const GET_INLINE_TYPE = {
  "~~": "strikethrough",
  "**": "strong",
  "*": "emphasis"
};

module.exports = function parseInlineStyle(o, tag) {
  const parseInline = require("./parseInline");

  return {
    type: GET_INLINE_TYPE[tag],
    children: parseInline({
      str: o.str,
      index: o.index + tag.length,
      length: o.str.indexOf(tag, o.index + tag.length)
    })
  };
};