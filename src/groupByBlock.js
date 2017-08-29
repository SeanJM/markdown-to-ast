const MATCH_CODE = require("./constants").MATCH_CODE;

function getLanguage(s) {
  const m = s.match(MATCH_CODE)[1];
  return m ? m : false;
}

module.exports = function groupByBlock(lines) {
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
          language: getLanguage(lines[t].children[0]),
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
};