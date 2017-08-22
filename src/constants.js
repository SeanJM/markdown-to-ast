const MATCH_LINK = /^\[([^\]]+)\]\(([^\]]+)\)/;
const MATCH_STRIKETHROUGH = /^~~([^\]]+?)~~/;
const MATCH_EMPHASIS = /^\*([^\]]+?)\*/;
const MATCH_STRONG = /^\*\*([^\]]+?)\*\*/;

module.exports = {
  MATCH_EMPHASIS,
  MATCH_LINK,
  MATCH_STRIKETHROUGH,
  MATCH_STRONG,
};