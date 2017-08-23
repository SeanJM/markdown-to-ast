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
```{type: "strong", children: ["Strong"]}```

\*Emphasis\*
```{type: "emphasis", children: ["Emphasis"]}```

\~\~Strikethrough\~\~
```{type: "strikethrough", children: ["Strikethrough"]}```

\[A link](http://www.google.com)
```{type: "a", href: "http://www.google.com", children: ["A link"]}```

\![A picture](http://www.cats.com/pictures/cat00001.jpg)
```{type: "img", src: "http://www.cats.com/pictures/cat00001.jpg", alt: "A picture"}```


### Block
\> Block quote
```{type: "quote", children: ["Block quote"]}```

\_\_\_ or \*\*\* or \-\-\-
```{type: "hr", children: []}```

Paragraph text
```{type: "p", children: ["Paragraph text"]}```

\# Heading
```{type: "h1", children: ["Heading"]}```

\- List items
\- List items
\- List items
```{type: "ul", children: [{type: "li", children: ["List items"]}...]}```

\1. Ordered list items
\2. Ordered list items
\3. Ordered list items
```{type: "ol", children: [{type: "li", children: ["Ordered list items"]}...]}```

# Notes
- Nesting block elements inside lists elements is not yet supported.
- Nesting block elements inside block quotes is not yet supported.
