const MATCH_EMPHASIS = /^\*([^\]]+?)\*/;
const MATCH_LINK = /^\[([^\]]+)\]\(([^\]]+)\)/;
const MATCH_RLINK = /^\[([^\]]+)\]\[([^\]]+)\]/;
const MATCH_REFERENCE = /^(?:\s+|)\[([^\]]+)\]: ((?:http(?:s|):\/\/|)[a-zA-Z0-9%\-_?=.#]+)$/;
const MATCH_PICTURE = /^!\[([^\]]+)\]\(([^\]]+)\)/;
const MATCH_STRIKETHROUGH = /^~~([^\]]+?)~~/;
const MATCH_STRONG = /^\*\*([^\]]+?)\*\*/;

module.exports = {
  MATCH_EMPHASIS,
  MATCH_LINK,
  MATCH_PICTURE,
  MATCH_REFERENCE,
  MATCH_RLINK,
  MATCH_STRIKETHROUGH,
  MATCH_STRONG
};