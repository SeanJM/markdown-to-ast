module.exports = function getBlockType(str) {
  if (/^(\s+|)#/.test(str)) {
    return "h" + str.match(/^(?:\s+|)([#]+)/)[0].length;
  } else if (/^(\s+|)-/.test(str)) {
    return "ul li";
  } else if (/^(\s+|)[0-9]/.test(str)) {
    return "ol li";
  } else {
    return "p";
  }
};