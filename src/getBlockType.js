module.exports = function getBlockType(str) {
  if (/^(\s+|)```/.test(str)) {
    return "code";
  } else if (/^(\s+|)([-]{3}|[*]{3}|[_]{3})/.test(str)) {
    return "hr";
  } else if (/^(\s+|)>/.test(str)) {
    return "quote";
  } else if (/^(\s+|)#/.test(str)) {
    return "h" + Math.min(6, str.match(/^(?:\s+|)([#]+)/)[0].length);
  } else if (/^(\s+|)(-|\*|\+)/.test(str)) {
    return "ul li";
  } else if (/^(\s+|)[0-9]/.test(str)) {
    return "ol li";
  } else {
    return "p";
  }
};