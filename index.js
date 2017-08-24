const getBlockType = require("./src/getBlockType");
const parseInline = require("./src/parseInline");
const processLines = require("./src/processLines");

function getDepth(str) {
  let depth = str.match(/^([ ]+)/m);
  return depth
    ? Math.floor(depth[1].length / 2)
    : 0;
}

module.exports = function parseBlock(str) {
  const lines = str
    .split("\n");

  for (let i = 0, n = lines.length; i < n; i++) {
    if (lines[i].trim().length) {
      lines[i] = {
        type: getBlockType(lines[i]),
        depth: getDepth(lines[i]),
        children: parseInline({
          str: lines[i].trim(),
          index: 0,
          length: lines[i].trim().length
        })
      };
    } else {
      lines[i] = {
        type: "newline",
        depth: 0
      };
    }
  }

  return processLines(lines);
};
