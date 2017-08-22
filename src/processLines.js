function processList(type, lines) {
  let merge = [];
  let i = 0;
  let depth = lines[0].depth;

  let element = {
    type: type,
    depth: depth,
    children: []
  };

  while (i < lines.length) {
    while (lines[i] && lines[i].depth > depth) {
      merge.push({
        type: "li",
        children: lines[i].children,
        depth: lines[i].depth + 1
      });

      i += 1;
    }

    if (merge.length) {
      i--;
      element.children.slice(-1)[0].children.push(
        processList(type, merge)
      );
    } else {
      element.children.push({
        type: "li",
        children: lines[i].children,
        depth: lines[i].depth + 1
      });
    }

    merge = [];
    i += 1;
  }

  return element;
}

function nestByType(props) {
  let collected = [];
  let i = 0;

  while (props.lines[i] && props.lines[i].type !== props.type) {
    i += 1;
  }

  while(props.lines[i] && props.lines[i].type === props.type) {
    collected.push(props.lines[i]);
    i += 1;
  }

  if (collected.length) {
    props.callback(
      collected,
      props.lines.indexOf(collected[0]),
      props.lines.indexOf(collected.slice(-1)[0])
    );
  }
}

module.exports = function processLines(lines) {
  nestByType({
    type: "ul li",
    lines: lines,
    callback: function (collected, start, end) {
      lines.splice(
        start,
        (end - start) + 1,
        processList(collected[0].type.split(" ")[0], collected)
      );
    },
  });

  nestByType({
    type: "ol li",
    lines: lines,
    callback: function (collected, start, end) {
      lines.splice(
        start,
        (end - start) + 1,
        processList(collected[0].type.split(" ")[0], collected)
      );
    },
  });

  return lines;
};