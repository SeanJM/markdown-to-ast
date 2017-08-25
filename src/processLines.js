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

function processQuote(collected) {
  const children = [];

  for (var i = 0, n = collected.length; i < n; i++) {
    [].push.apply(children, collected[i].children);
  }

  return {
    type: "quote",
    depth: collected[0].depth,
    children: children
  };
}

function groupByBlock(lines) {
  const containing_blocks = [ "quote", "ul li", "ol li" ];
  const groups = [];
  let group;

  let i = 0;
  let n = lines.length;
  let t;

  while (i < n) {
    group = {};
    if (containing_blocks.indexOf(lines[i].type) > -1) {
      group.type = lines[i].type;
      group.children = [];

      while (i < n && lines[i].type !== "newline") {
        group.children.push(lines[i]);
        i += 1;
      }

      groups.push(group);
    } else if (lines[i].type === "code") {
      t = i;
      i += 1;

      while (i < n && lines[i].type !== "code") {
        i += 1;
      }

      if (lines[i] && lines[i].type === "code") {
        groups.push({
          type: "code",
          depth: lines[i].depth,
          children: [].concat.apply([],
            lines
              .slice(t + 1, i)
              .map(function (child) {
                return child.children;
              })
          )
        });
      } else {
        lines[t].type = "p";
        groups.push(lines[t]);
        i = t;
      }
    } else {
      groups.push(lines[i]);
    }

    i += 1;
  }

  return groups;
}

module.exports = function processLines(lines) {
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
};