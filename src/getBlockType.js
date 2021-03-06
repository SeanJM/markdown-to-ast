const MATCH_REFERENCE = require("./constants").MATCH_REFERENCE;
const MATCH_CODE = require("./constants").MATCH_CODE;

module.exports = function getBlockType(str) {
  if (MATCH_CODE.test(str)) {
    return "code";
  } else if (/^(\s+|)([-]{3}|[*]{3}|[_]{3})/.test(str)) {
    return "hr";
  } else if (/^(\s+|)>/.test(str)) {
    return "quote";
  } else if (/^(\s+|)#/.test(str)) {
    return "h" + Math.min(6, str.match(/^(?:\s+|)([#]+)/)[0].length);
  } else if (/^(\s+|)(-|\*|\+)\s/.test(str)) {
    return "ul li";
  } else if (/^(\s+|)[0-9]/.test(str)) {
    return "ol li";
  } else if (MATCH_REFERENCE.test(str)) {
    return "ref";
  } else {
    return "p";
  }
};