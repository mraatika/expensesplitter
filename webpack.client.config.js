/* eslint-env node */

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var packageJSON = require('./package.json');
var path = require('path');

var env = process.env.NODE_ENV || 'dev';
var isProd = env === 'prod';

var PATHS = {
    app: '/src/client',
    src: '/src',
    build: './build/client'
};

/**
 * UglifyJsPlugin options
 * @type {Object}
 */
var uglifyOptions = {
    mangle: false,
    compress: { warnings: false },
    output: { comments: false }
};

/**
 * CommonsChunkPlugin options
 * @type {Object}
 */
var commonsChunkOptions = {
    name: 'vendor',
    filename: 'vendor.js',
    minChunks: Infinity
};

/**
 * HtmlWebpackPlugin options
 * @type {Object}
 */
var htmlOptions = {
    template: __dirname + '/src/index.html',
    title: packageJSON.name
};

/**
 * Webpack dev server options
 * @type {Object}
 */
var devServerOptions = {
    contentBase: path.resolve(__dirname, PATHS.build),
    historyApiFallback: {
        rewrites: [
            { from: /^\/$/, to: '/' }
        ]
    },
    colors: true,
    inline: true,
    progress: true,
    port: 4932,
    proxy: {
        '/api': {
            target: 'http://localhost:8080',
            pathRewrite: {'^/api' : ''}
        }
    }
};

/**
 * ExtractTextPlugin options (css file generation)
 * @type {Object}
 */
var extractTextPluginOptions = {
    file: 'main.css',
    settings: {
        allChunks: true
    }
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

/**
 * Plugins array. CommonsChunk and HtmlWebpackPlugin runs on dev and prod builds. Optimization
 * plugins are only used in prod mode
 * @type {Array}
 */
var plugins = [
    new webpack.optimize.CommonsChunkPlugin(commonsChunkOptions),
    new HtmlWebpackPlugin(htmlOptions),
    new ExtractTextPlugin(extractTextPluginOptions.file, extractTextPluginOptions.settings)
];

// plugins used only when building a production version
if (isProd) {
    plugins = plugins.concat([
        new webpack.optimize.UglifyJsPlugin(uglifyOptions),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
    ]);
// plugins used only when building a development version
} else {
    plugins = plugins.concat([
        new webpack.HotModuleReplacementPlugin()
        //new webpack.NoErrorsPlugin()
    ]);

}

module.exports = {
    entry: {
        app: __dirname + PATHS.app + '/index.jsx',
        vendor: [
            'axios',
            'classnames',
            'lodash',
            'react',
            'react-addons-test-utils',
            'react-bootstrap',
            'react-dom',
            'react-notification-system',
            'react-redux',
            'react-router',
            'react-router-redux',
            'react-swipeable',
            'redux',
            'redux-thunk',
            'redux-logger',
            'shortid'
        ]
    },

    output: {
        path: path.resolve(__dirname, PATHS.build),
        filename: 'app.js',
        publicPath: '/'
    },

    module: {

        preLoaders: [
            {
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                include: __dirname + '/src'
            }
        ],

        loaders: [
            {
                test: /\.jsx?/,
                loaders: ['babel?cacheDirectory'],
                include: __dirname + '/src'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style?sourceMap', 'css?sourceMap!resolve-url!sass?sourceMap')
            },/*
            {
                test: /\.scss$/,
                loaders: [
                    'style?sourceMap',
                    'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]&sourceMap',
                    'resolve-url',
                    'sass?sourceMap'
                ]
            },*/
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file'
            }
        ]
    },

    resolve: {
        root: [path.resolve('./src')],
        modulesDirectories: ['src/common', 'node_modules', 'src/client', 'src']
    },

    debug: !isProd,

    devtool: isProd ? 'source-map' : 'eval-source-map',

    devServer: devServerOptions,

    eslint: eslintOptions,

    plugins: plugins
};