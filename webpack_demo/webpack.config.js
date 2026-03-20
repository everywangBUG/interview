const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
    // anther: "./src/another-module.js",
    // index: {
    //   import: "./src/index.js",
    //   dependOn: "shared",
    // },
    // another: {
    //   import: "./src/another-module.js",
    //   dependOn: "shared",
    // },
    // shared: "lodash",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Caching",
    }),
  ],
  output: {
    // filename: "bundle.js",
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // 每次打包之前清理/dist
  },
  optimization: {
    // moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ["csv-loader"]
      },
      {
        test: /\.xml$/i,
        use: ["xml-loader"]
      }
    ],
  },
};
