const path = require('path');
const miniCss = require('mini-css-extract-plugin');
module.exports = {
    mode: 'production',
    entry: './index.js',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [miniCss.loader, 'css-loader'],
            },
            // {
            //     test: /\.(eot|svg|ttf|woff|woff2)\w*/,
            //     use: [
            //         {
            //             loader: 'file-loader',
            //             options: {
            //                 publicPath: '/static/res/',
            //                 outputPath: 'font/',
            //             },
            //         },
            //     ],
            // },
            {
                test: /\.(eot|svg|ttf|woff|woff2)\w*/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000000000,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new miniCss({
            filename: 'css/[name].css',
        }),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
};
