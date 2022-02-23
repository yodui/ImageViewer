const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "ImageViewer.bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
        libraryTarget: 'umd'
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, ''),
        },
        historyApiFallback: true,
        open: true,
        compress: true,
        port: 9000
    }
};
