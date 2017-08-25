const getBlockType = require("./getBlockType");
const parseInline = require("./parseInline");
const groupByBlock = require("./groupByBlock");

function getLineDepth(str) {
  let depth = str.match(/^([ ]+)/m);
  return depth
    ? Math.floor(depth[1].length / 2)
    : 0;
}

function processLines(lines) {
  const groups = groupByBlock(lines);
  let filtered = [];

  for (var i = 0, n = groups.length; i < n; i++) {
    if (groups[i].type === "ul li" || groups[i].type === "ol li") {
      filtered.push(processList(groups[i].children));
    } else if (groups[i].type === "quote") {
      filtered.push(processQuote(groups[i].children));
    } else if (groups[i].type !== "newline") {
      filtered.push(groups[i]);
    }
  }

  return filtered;
}

function processQuote(collected) {
  const children = [];

  for (var i = 0, n = collected.length; i < n; i++) {
    [].push.apply(children, collected[i].children);
  }

  return {
    type: "quote",
    depth: collected[0].depth,
    children: parseBlock(children)
  };
}

function processList(lines) {
  let merge = [];
  let i = 0;
  let depth = lines[0].depth;
  let n = lines.length;

  let element = {
    type: lines[0].type === "ol li"
      ? "ol"
      : "ul",
    depth: depth,
    children: []
  };

  while (i < n) {
    while (lines[i] && lines[i].depth > depth) {
      merge.push({
        type: lines[i].type,
        children: lines[i].children,
        depth: lines[i].depth + 1
      });
      i += 1;
    }

    if (merge.length) {
      i--;
      element.children.slice(-1)[0].children.push(
        processList(merge)
      );
    } else if (lines[i].type === "ul li" || lines[i].type === "ol li") {
      element.children.push({
        type: "li",
        children: lines[i].children,
        depth: lines[i].depth + 1
      });
    } else {
      // Append the child to the last list element
      element.children.slice(-1)[0].children.push({
        type: lines[i].type,
        children: lines[i].children,
        depth: lines[i].depth + 1
      });
    }

    merge = [];
    i += 1;
  }

  return element;
}

function parseBlock(lines) {
  for (let i = 0, n = lines.length; i < n; i++) {
    if (lines[i].trim().length) {
      lines[i] = {
        type: getBlockType(lines[i]),
        depth: getLineDepth(lines[i]),
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
}

module.exports = parseBlock;
