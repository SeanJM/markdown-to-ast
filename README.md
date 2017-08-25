# File size
## 4.89KB

# Installation
```
$ npm i -D markdown-simple-ast
```

# Usage
```javascript
  const md = require("markdown-simple-ast");
  md("# Markdown\nParagraph");
  // [{
  //    type: "h1",
  //    depth: 0,
  //    children: ["Markdown"]
  // }, {
  //    type: "p",
  //    depth: 0,
  //    children: ["Paragraph"]
  //  }
  // ]
```

# Node types
### Inline
\*\*Strong\*\*
```
  {
    type: "strong",
    children: ["Strong"]
  }
```

\*Emphasis\*
```
  {
    type: "emphasis",
    children: ["Emphasis"]
  }
```

\~\~Strikethrough\~\~
```
  {
    type: "strikethrough",
    children: ["Strikethrough"]
  }
```

\[A link](http://www.google.com)
```
  {
    type: "a",
    href: "http://www.google.com",
    children: ["A link"]
  }
```

\![A picture](http://www.cats.com/pictures/cat00001.jpg)
```
  {
    type: "img",
    src: "http://www.cats.com/pictures/cat00001.jpg",
    alt: "A picture"
  }
```


### Block

- `depth` is relative depth to the block parent

\> Block quote
```
  {
    type: "quote",
    depth: 0,
    children: [{
      type: "p",
      depth: 0,
      children: ["Block quote"]
    }]
  }
```

\_\_\_ or \*\*\* or \-\-\-
```
  {
    type: "hr",
    depth: 0,
    children: []
  }
```

Paragraph text
```
  {
    type: "p",
    depth: 0,
    children: ["Paragraph text"]
  }
```

\# Heading

Maximum heading size is `6`

```
  {
    type: "h1",
    depth: 0,
    children: ["Heading"]
  }
```

\- List items
\- List items
\- List items
```
  {
    type: "ul",
    depth: 0,
    children: [{
      type: "li",
      children: ["List items"]
    }
    ...
    ]
  }
```

\1. Ordered list items
\2. Ordered list items
\3. Ordered list items
```
  {
    type: "ol",
    depth: 0,
    children: [{
      type: "li",
      children: ["Ordered list items"]
    }
    ...
    ]
  }
```