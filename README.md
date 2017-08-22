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

# Notes
- Nesting block elements inside lists elements is not yet supported.  
- Nesting block elements inside block quotes is not yet supported.
