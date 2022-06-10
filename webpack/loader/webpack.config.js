const path = require('path'),
    testPlugin = require('./test-plugin');
module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './main.js'),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: path.resolve('./replace-loader'),
                        options: {
                            words: 're',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [new testPlugin()],
};
