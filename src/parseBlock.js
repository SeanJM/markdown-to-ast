const getBlockType = require("./getBlockType");
const parseInline = require("./parseInline");
const groupByBlock = require("./groupByBlock");
const MATCH_REFERENCE = require("./constants").MATCH_REFERENCE;

function getLineDepth(str) {
  let depth = str.match(/^([ ]+)/m);
  return depth
    ? Math.floor(depth[1].length / 2)
    : 0;
}

function processReference(node) {
  const m = node.children[0].match(MATCH_REFERENCE);
  return {
    type: node.type,
    depth: node.depth,
    href: m[2],
    link: m[1].toLowerCase()
  };
}

function processQuote(collected) {
  const children = [];

  for (let i = 0, n = collected.length; i < n; i++) {
    [].push.apply(children, collected[i].children);
  }

  for (let i = 0, n = children.length; i < n; i++) {
    if (typeof children[i] === "string") {
      children[i] = children[i].trim();
    }
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

function processLines(lines) {
  const groups = groupByBlock(lines);
  let filtered = [];

  for (var i = 0, n = groups.length; i < n; i++) {
    if (groups[i].type === "ul li" || groups[i].type === "ol li") {
      filtered.push(processList(groups[i].children));
    } else if (groups[i].type === "quote") {
      filtered.push(processQuote(groups[i].children));
    } else if (groups[i].type === "ref") {
      filtered.push(processReference(groups[i]));
    } else if (groups[i].type !== "newline") {
      filtered.push(groups[i]);
    }
  }

  return filtered;
}

function parseBlock(lines) {
  let excludeInline = ["code"];
  let excluded = false;
  let type = undefined;

  for (let i = 0, n = lines.length; i < n; i++) {
    if (lines[i].trim().length) {
      type = getBlockType(lines[i]);

      if (excluded && type === excluded) {
        excluded = false;
      } else if (excludeInline.indexOf(type) > -1) {
        excluded = type;
      }

      lines[i] = {
        type: type,
        depth: getLineDepth(lines[i]),
        children: (
          excluded
            ? [ lines[i] ]
            : parseInline({
              str: lines[i],
              index: 0,
              length: lines[i].length
            })
        )
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
