const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    module: {
        rules: [
        ...(isDev
            ? []
            : [
                {
                test: /\.js$/,
                enforce: 'pre',
                loader: 'source-map-loader',
                exclude: /node_modules/,
                },
            ]),
        ],
    },
    ...(isDev && {
        devServer: {
        hot: true,
        liveReload: false,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: /node_modules/,
        },
        },
        optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
        },
    }),
};
