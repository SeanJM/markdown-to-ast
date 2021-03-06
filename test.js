const tinytest = require("tiny-test");
const md = require("./src/index.js");

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

  test("H2")
    .this(function () {
      return md("## Heading");
    })
    .isDeepEqual(function () {
      return [{
        type: "h2",
        depth: 0,
        children: [ "Heading" ]
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

  test("Emphasis")
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

  test("Emphasis (Incorrect)")
    .this(function () {
      let markdown = md("A *line");
      return markdown;
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: ["A *line"]
      }];
    });

  test("Strikethrough")
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

  test("Strikethrough (Incorrect)")
    .this(function () {
      return md("A ~~strikethrough");
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: ["A ~~strikethrough"]
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

  test("strikethrough complex (Incorrect)")
    .this(function () {
      return md("A ~~strikethrough~ text line");
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: ["A ~~strikethrough~ text line"]
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

  test("mixed emphasis (2)")
    .this(function () {
      const str = "The really ***good*** thing";
      const markdown = md(str);
      return markdown;
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: [
          "The really ", {
            type: "emphasis",
            children: [{
              type: "strong",
              children: ["good"]
            }]
          },
          " thing"
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

  test("Unordered List (*)")
    .this(function () {
      return md("* list item\n* list item 2\n  * list item 2: 1\n  * list item 2: 2\n* list item 3");
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

  test("Unordered List (+)")
    .this(function () {
      return md("+ list item\n+ list item 2\n  + list item 2: 1\n  + list item 2: 2\n+ list item 3");
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

  test("Ordered list (Nested)")
    .this(function () {
      return md("1. Ordered list item\n2. Ordered list item\n  1. Ordered list item");
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
          children: ["Ordered list item", {
            type: "ol",
            depth: 2,
            children: [{
              type: "li",
              depth: 3,
              children: ["Ordered list item"]
            }]
          }]
        }]
      }];
    });

  test("Quote")
    .this(function () {
      return md("> This is a block quote");
    })
    .isDeepEqual(function () {
      return [{
        type: "quote",
        depth: 0,
        children: [{
          type: "p",
          depth: 0,
          children: ["This is a block quote"]
        }]
      }];
    });

  test("Quote multiline")
    .this(function () {
      return md("> This is a block quote\n> This line is part of the original quote");
    })
    .isDeepEqual(function () {
      return [{
        type: "quote",
        depth: 0,
        children: [{
          type: "p",
          depth: 0,
          children: ["This is a block quote"]
        }, {
          type: "p",
          depth: 0,
          children: ["This line is part of the original quote"]
        }]
      }];
    });

  test("Horizontal rule")
    .this(function () {
      return md("___\n***\n---");
    })
    .isDeepEqual(function () {
      return [{
        type: "hr",
        depth: 0,
        children: []
      }, {
        type: "hr",
        depth: 0,
        children: []
      }, {
        type: "hr",
        depth: 0,
        children: []
      }];
    });

  test("Link")
    .this(function () {
      return md("[This is a link](http://www.google.com)");
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: [{
          type: "a",
          href: "http://www.google.com",
          children: ["This is a link"]
        }]
      }];
    });

  test("Link with text")
    .this(function () {
      return md("I think this [is a link](http://www.google.com) to google");
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: ["I think this ", {
          type: "a",
          href: "http://www.google.com",
          children: ["is a link"]
        }, " to google"]
      }];
    });

  test("Code")
    .this(function () {
      return md("```\n  function () {}\n```");
    })
    .isDeepEqual(function () {
      return [{
        type: "code",
        language: false,
        depth: 0,
        children: ["  function () {}"]
      }];
    });

  test("Code (Empty line)")
    .this(function () {
      const markdown = md("```\n  function () {}\n\n  function () {}\n```");
      return markdown;
    })
    .isDeepEqual(function () {
      return [{
        type: "code",
        language: false,
        depth: 0,
        children: [
          "  function () {}",
          "\n",
          "  function () {}",
        ]
      }];
    });

  test("Code (Javascript)")
    .this(function () {
      return md("```javascript\nfunction () {}\n```");
    })
    .isDeepEqual(function () {
      return [{
        type: "code",
        language: "javascript",
        depth: 0,
        children: ["function () {}"]
      }];
    });

  test("Code (Ignore inline style)")
    .this(function () {
      return md("```javascript\n`function` () {}\n```");
    })
    .isDeepEqual(function () {
      return [{
        type: "code",
        language: "javascript",
        depth: 0,
        children: ["`function` () {}"]
      }];
    });

  test("Incorrectly formatted code")
    .this(function () {
      return md("```\nfunction () {}\n");
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: ["```"]
      }, {
        type: "p",
        depth: 0,
        children: ["function () {}"]
      }];
    });

  test("Picture")
    .this(function () {
      return md("![some alt text](http://www.google.com/picture.jpeg)");
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: [{
          type: "img",
          src: "http://www.google.com/picture.jpeg",
          alt: "some alt text"
        }]
      }];
    });

  test("List with paragraph child")
    .this(function () {
      return md("- This is a list item\nWith a paragraph child");
    })
    .isDeepEqual(function () {
      return [{
        type: "ul",
        depth: 0,
        children: [{
          type: "li",
          depth: 1,
          children: ["This is a list item", {
            type: "p",
            depth: 1,
            children: ["With a paragraph child"]
          }]
        }]
      }];
    });

  test("List with paragraph child (complex)")
    .this(function () {
      return md("- This is a list item\nWith a paragraph child\n- This is another list item");
    })
    .isDeepEqual(function () {
      return [{
        type: "ul",
        depth: 0,
        children: [{
          type: "li",
          depth: 1,
          children: ["This is a list item", {
            type: "p",
            depth: 1,
            children: ["With a paragraph child"]
          }]
        }, {
          type: "li",
          depth: 1,
          children: ["This is another list item"]
        }]
      }];
    });

  test("Multiple elements mixed together")
    .this(function () {
      const str = "- He's friendly\n- His heart glows\n- He purs like a kitty\n\n> ET is awesome";
      const markdown = md(str);
      return markdown;
    })
    .isDeepEqual(function () {
      return [{
        type: "ul",
        depth: 0,
        children: [{
          type: "li",
          depth: 1,
          children: ["He's friendly"]
        }, {
          type: "li",
          depth: 1,
          children: ["His heart glows"]
        }, {
          type: "li",
          depth: 1,
          children: ["He purs like a kitty"]
        }]
      }, {
        type: "quote",
        depth: 0,
        children: [{ type: "p", depth: 0, children: ["ET is awesome"]}]
      }];
    });

  test("Nested quotes")
    .this(function () {
      const str = "> ET is awesome\n> > This quote is nested";
      const markdown = md(str);
      return markdown;
    })
    .isDeepEqual(function () {
      return [{
        type: "quote",
        depth: 0,
        children: [{
          type: "p",
          depth: 0,
          children: ["ET is awesome"]
        }, {
          type: "quote",
          depth: 0,
          children: [{
            type: "p",
            depth: 0,
            children: ["This quote is nested"]
          }]
        }]
      }];
    });

  test("Inline style siblings")
    .this(function () {
      const str = "**A** ~~B~~ *C*";
      const markdown = md(str);
      return markdown;
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: [{
          type: "strong",
          children: ["A"]
        }, " ", {
          type: "strikethrough",
          children: ["B"]
        }, " ", {
          type: "emphasis",
          children: ["C"]
        }]
      }];
    });

  test("Reference style link")
    .this(function () {
      const str = "[I'm a reference-style link][Arbitrary case-insensitive reference text]";
      const markdown = md(str);
      return markdown;
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: [{
          type: "rlink",
          href: "arbitrary case-insensitive reference text",
          children: ["I'm a reference-style link"]
        }]
      }];
    });

  test("Reference text")
    .this(function () {
      const str = "[arbitrary case-insensitive reference text]: https://www.mozilla.org";
      const markdown = md(str);
      return markdown;
    })
    .isDeepEqual(function () {
      return [{
        type: "ref",
        depth: 0,
        link: "arbitrary case-insensitive reference text",
        href: "https://www.mozilla.org"
      }];
    });

  test("Inline code")
    .this(function () {
      const str = "In `package.json` there is a key";
      const markdown = md(str);
      return markdown;
    })
    .isDeepEqual(function () {
      return [{
        type: "p",
        depth: 0,
        children: ["In ", { type: "inline-code", children: ["package.json"] }, " there is a key"],
      }];
    });

  load();
});