const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = env => {
    return {
        entry: "./src/index.ts",
        devtool: "source-map",
        mode: env.NODE_ENV === "prod" ? "production" : "development",
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: ["ts-loader", "tslint-loader"],
                    exclude: /node_modules/
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                hash: true,
                title: "Dancing donuts",
                template: "./src/index.html",
                filename: "./index.html"
            }),
            new CopyPlugin([
                { from: "./src/background.jpg", to: "./", flatten: true },
            ]),
       ],
        resolve: {
            extensions: [ ".ts", ".js" ],
        },
        output: {
            filename: "dancing-donuts.min.js",
            path: path.resolve(__dirname, "dist")
        },
        devServer: {
            contentBase: path.join(__dirname, "dist"),
            host: "0.0.0.0"
        }
    };
};
