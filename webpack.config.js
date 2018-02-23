const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ["ts-loader", "tslint-loader"],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ ".ts", ".js" ]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    contentBase: path.join(__dirname, "dist")
  }
};
