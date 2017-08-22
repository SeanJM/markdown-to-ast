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
    .split("\n")
    .filter(a => a.length);

  for (let i = 0, n = lines.length; i < n; i++) {
    lines[i] = {
      type: getBlockType(lines[i]),
      depth: getDepth(lines[i]),
      children: parseInline({
        str: lines[i].trim(),
        index: 0,
        length: lines[i].trim().length
      })
    };
  }

  return processLines(lines);
};
