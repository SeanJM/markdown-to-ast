const path = require("path");
const webpack = require("webpack");

module.exports = {
  module : {
    loaders : [
      {
        loader : "babel-loader",
        include : [
          path.resolve(__dirname, "src/"),
        ],
        exclude : [
          path.resolve(__dirname, "src/styles/"),
          path.resolve(__dirname, "src/styles/index.scss")
        ],
        test : /\.js$/,
        query : {
          presets : [ "env" ]
        }
      }
    ],
  },

  entry : [ "./src/index.js" ],

  output : {
    libraryTarget : "commonjs-module",
    filename : "index.js",
    path : path.resolve(__dirname, "./")
  },

  devtool: process.env.NODE_ENV === "development"
    ? "#eval-source-map"
    : false,

  plugins: process.env.NODE_ENV === "production"
    ? [
      new webpack.optimize.UglifyJsPlugin({ minimize: true }),
      new webpack.optimize.OccurrenceOrderPlugin()
    ]
    : []
};