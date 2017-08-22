const tinytest = require("tiny-test");
const md = require("./index.js");

tinytest(function (test, load) {
  test("basic")
    .this(function () {
      return md("markdown");
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: [ "markdown" ]
      }];
    });

  test("heading and paragraph")
    .this(function () {
      return md("# Heading 1\nAnd some text");
    })
    .isDeepEqual(function () {
      return [{
        type: "h1",
        depth: 0,
        children: [ "Heading 1" ]
      }, {
        type: "p",
        depth: 0,
        children: [ "And some text" ]
      }];
    });

  test("list")
    .this(function () {
      return md("\n- A line\n- And another line");
    })
    .isDeepEqual(function () {
      return [{
        type: "ul",
        depth: 0,
        children: [{
          type: "li",
          depth: 1,
          children: ["A line"]
        }, {
          type: "li",
          depth: 1,
          children: ["And another line"]
        }]
      }];
    });

  test("heading and paragraph")
    .this(function () {
      return md("# Heading 1\nAnd some text\n- This is the first list item\n- This is the second list item");
    })
    .isDeepEqual(function () {
      return [{
        type: "h1",
        depth: 0,
        children: [ "Heading 1" ]
      }, {
        type: "p",
        depth: 0,
        children: [ "And some text" ]
      }, {
        type: "ul",
        depth: 0,
        children: [{
          type: "li",
          depth: 1,
          children: ["This is the first list item"]
        }, {
          type: "li",
          depth: 1,
          children: ["This is the second list item"]
        }]
      }];
    });

  test("emphasis")
    .this(function () {
      return md("A *line*");
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: ["A ", { type: "emphasis", children: [ "line" ] }]
      }];
    });

  test("strikethrough")
    .this(function () {
      return md("A ~~strikethrough~~");
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: ["A ", { type: "strikethrough", children: [ "strikethrough" ] }]
      }];
    });

  test("strikethrough complex")
    .this(function () {
      return md("A ~~strikethrough~~ text line");
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: [
          "A ",
          {
            type: "strikethrough",
            children: [ "strikethrough" ]
          },
          " text line"
        ]
      }];
    });

  test("mixed ephasis")
    .this(function () {
      return md("A **~~strikethrough~~** text line");
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: [
          "A ",
          {
            type: "strong",
            children: [{
              type: "strikethrough",
              children: [ "strikethrough" ]
            }]
          },
          " text line"
        ]
      }];
    });

  test("Nested unordered List")
    .this(function () {
      return md("- list item\n- list item 2\n  - list item 2: 1\n  - list item 2: 2\n- list item 3");
    })
    .isDeepEqual(function () {
      return [{
        type: "ul",
        depth: 0,
        children: [
          {
            type: "li",
            depth: 1,
            children: ["list item"]
          }, {
            type: "li",
            depth: 1,
            children: [
              "list item 2", {
                type: "ul",
                depth: 2,
                children: [{
                  type: "li",
                  depth: 3,
                  children: ["list item 2: 1"]
                }, {
                  type: "li",
                  depth: 3,
                  children: ["list item 2: 2"]
                }]
              }
            ]
          }, {
            type: "li",
            depth: 1,
            children: ["list item 3"]
          }
        ]
      }];
    });

  test("Ordered list")
    .this(function () {
      return md("1. Ordered list item\n2. Ordered list item\n");
    })
    .isDeepEqual(function () {
      return [{
        type: "ol",
        depth: 0,
        children: [{
          type: "li",
          depth: 1,
          children: ["Ordered list item"]
        }, {
          type: "li",
          depth: 1,
          children: ["Ordered list item"]
        }]
      }];
    });

  load();
});