const MATCH_LINK = /^\[([^\]]+)\]\(([^\]]+)\)/;
const MATCH_RLINK = /^\[([^\]]+)\]\[([^\]]+)\]/;
const MATCH_REFERENCE = /^(?:\s+|)\[([^\]]+)\]: ((?:http(?:s|):\/\/|)[a-zA-Z0-9%\-_?=.#]+)$/;
const MATCH_PICTURE = /^!\[([^\]]+)\]\(([^\]]+)\)/;
const MATCH_STRIKETHROUGH = /^~~([^\]]+?)~~/;
const MATCH_CODE = /^(?:\s+|)```([a-zA-Z]+|)/;
const MATCH_INLINE_CODE = /^`([^`]+)`/;

module.exports = {
  MATCH_CODE,
  MATCH_INLINE_CODE,
  MATCH_LINK,
  MATCH_PICTURE,
  MATCH_REFERENCE,
  MATCH_RLINK,
  MATCH_STRIKETHROUGH
};