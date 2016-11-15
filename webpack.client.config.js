/* eslint-env node */

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var packageJSON = require('./package.json');
var path = require('path');

var env = process.env.NODE_ENV || 'dev';
var isProd = env === 'prod';

var PATHS = {
    app: path.join(__dirname, 'src', 'client'),
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build', 'client')
};

/**
 * UglifyJsPlugin options
 * @type {Object}
 */
var uglifyOptions = {
    mangle: false,
    compress: {
        warnings: false,
        screw_ie8: true
    },
    output: { comments: false }
};

/**
 * CommonsChunkPlugin options
 * @type {Object}
 */
var commonsChunkOptions = {
    name: 'vendor',
    filename: 'vendor.[hash].js',
    minChunks: 2
};

/**
 * HtmlWebpackPlugin options
 * @type {Object}
 */
var htmlOptions = {
    template: path.join(PATHS.src, 'index.html'),
    title: 'ExpenseSplitter'
};

/**
 * Webpack dev server options
 * @type {Object}
 */
var devServerOptions = {
    contentBase: PATHS.build,
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
    file: 'main.[hash].css',
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

var definePluginOptions = {
    'process.env':{
        'NODE_ENV': JSON.stringify(env),
        'APP_VERSION': JSON.stringify(packageJSON.version)
    }
};

/**
 * Plugins array. CommonsChunk and HtmlWebpackPlugin runs on dev and prod builds. Optimization
 * plugins are only used in prod mode
 * @type {Array}
 */
var plugins = [
    new webpack.optimize.CommonsChunkPlugin(commonsChunkOptions),
    new HtmlWebpackPlugin(htmlOptions),
    new ExtractTextPlugin(extractTextPluginOptions.file, extractTextPluginOptions.settings),
    new webpack.DefinePlugin(definePluginOptions)
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
    ]);
}

module.exports = {
    entry: {
        app: path.join(PATHS.app, 'index.jsx'),
        vendor: [
            'axios',
            'classnames',
            'react',
            'react-dom',
            'react-bootstrap/lib/Modal',
            'react-bootstrap/lib/Panel',
            'react-notification-system',
            'react-redux',
            'react-router',
            'react-swipeable',
            'redux',
            'redux-thunk',
            'shortid'
        ]
    },

    output: {
        path: PATHS.build,
        filename: '[name].[hash].js',
        publicPath: '/'
    },

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
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style?sourceMap', 'css?sourceMap!resolve-url!sass?sourceMap&name=[name].[hash].[ext]')
            },
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
        root: [PATHS.src]
    },

    debug: !isProd,

    devtool: isProd ? 'source-map' : 'eval-source-map',

    devServer: devServerOptions,

    eslint: eslintOptions,

    plugins: plugins
};