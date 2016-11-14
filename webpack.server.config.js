/* eslint-env node */
var path = require('path');

var env = process.env.NODE_ENV || 'dev';
var isProd = env === 'prod';

var PATHS = {
    app: path.join(__dirname, 'src', 'server'),
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build', 'server')
};

/**
 * Eslint options
 * @type {Object}
 */
var eslintOptions = {
    config: './.eslintrc',
    emitError: true,
    failOnError: true
};

module.exports = {
    entry: path.join(PATHS.app, 'index.js'),

    output: {
        path: PATHS.build,
        filename: 'server.js'
    },

    target: 'node',

    libraryTarget: 'commonjs2',

    module: {

        preLoaders: [
            {
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                include: PATHS.src
            }
        ],

        loaders: [
            {
                test: /\.jsx?/,
                loaders: ['babel?cacheDirectory'],
                include: PATHS.src
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },

    debug: !isProd,

    resolve: {
        root: [PATHS.src]
    },

    devtool: 'source-map',

    eslint: eslintOptions
};