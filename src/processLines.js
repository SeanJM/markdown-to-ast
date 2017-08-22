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

function processCode(lines) {
  const children = [];

  for (var i = 1, n = lines.length - 1; i < n; i++) {
    [].push.apply(children, lines[i].children);
  }

  return {
    type: "code",
    depth: lines[0].depth,
    children: children
  };
}

function groupByType(props) {
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

function groupCode(props) {
  let i = 0;
  let start;
  let end;

  while (props.lines[i] && props.lines[i].type !== "code") {
    i += 1;
  }

  if (props.lines[i] && props.lines[i].type === "code") {
    start = i;
    i += 1;
  }

  while (props.lines[i] && props.lines[i].type !== "code") {
    i += 1;
  }

  if (i !== start && props.lines[i] && props.lines[i].type === "code") {
    end = i;
  }

  if (typeof start !== "undefined" && typeof end !== "undefined" ) {
    props.callback(props.lines.slice(start, end + 1), start, end);
  } else if (typeof start !== "undefined") {
    props.error(props.lines[start]);
  }
}

module.exports = function processLines(lines) {
  groupByType({
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

  groupByType({
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

  groupByType({
    type: "quote",
    lines: lines,
    callback: function (collected, start, end) {
      lines.splice(
        start,
        (end - start) + 1,
        processQuote(collected)
      );
    },
  });

  groupCode({
    lines: lines,
    callback: function (collected, start, end) {
      lines.splice(
        start,
        (end - start) + 1,
        processCode(collected)
      );
    },
    error: function (element) {
      element.type = "p";
    }
  });

  return lines;
};