const parseBlock = require("./parseBlock");

module.exports = function (str) {
  return parseBlock(str.split("\n"));
};
