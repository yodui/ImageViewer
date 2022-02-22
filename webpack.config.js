const path = require('path');

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "ImageViewer.js",
        path: path.resolve(__dirname, "dist"),
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
