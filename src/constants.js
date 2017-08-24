const MATCH_EMPHASIS = /^\*([^\]]+?)\*/;
const MATCH_LINK = /^\[([^\]]+)\]\(([^\]]+)\)/;
const MATCH_PICTURE = /^!\[([^\]]+)\]\(([^\]]+)\)/;
const MATCH_STRIKETHROUGH = /^~~([^\]]+?)~~/;
const MATCH_STRONG = /^\*\*([^\]]+?)\*\*/;

module.exports = {
  MATCH_EMPHASIS,
  MATCH_LINK,
  MATCH_PICTURE,
  MATCH_STRIKETHROUGH,
  MATCH_STRONG
};