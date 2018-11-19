const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: "./src/index.ts",
    devtool: "source-map",
    mode: "production",
    module: {
    rules: [
        {
            test: /\.ts?$/,
            use: ["ts-loader", "tslint-loader"],
            exclude: /node_modules/
        },
        {
            test: /\.pcss$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader
                },
                {
                    loader: "css-loader",
                    options: {
                        modules: true,
                        importLoaders: 1,
                    }
                },
                {
                    loader: "postcss-loader",
                }
            ]
        }
    ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: "Donuts",
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({ filename: "styles.css" })
   ],
    resolve: {
        extensions: [ ".ts", ".js" ]
    },
    output: {
        filename: "donuts.min.js",
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        contentBase: path.join(__dirname, "dist")
    }
};
