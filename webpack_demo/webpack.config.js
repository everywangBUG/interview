const path = require("path");

module.exports = {
  entry: {
    // index: "./src/index.js",
    // anther: "./src/another-module.js",
    index: {
      import: "./src/index.js",
      dependOn: "shared"
    },
    another: {
      import : "./src/another-module.js",
      dependOn: "shard"
    },
    shared: "lodash"
  },
  output: {
    // filename: "boundle.js",
    filename: "[name].boundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    runtimeChunk: "single"
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource"
      }
    ],
  }
};
