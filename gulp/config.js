var dest = './dist';
var src = './src';
var gutil = require('gulp-util');
var modRewrite = require('connect-modrewrite');

var isDev = gutil.env.type === 'dev';

module.exports = {
    server: {
        settings: {
            root: dest,
            host: 'localhost',
            port: 4932,
            livereload: {
                port: 35929
            },
            middleware: function() {
                return [
                    modRewrite(
                        [
                            '^/api/(.*)$ http://localhost:8080/$1 [P]',
                            '!\\.\\w+$ /index.html [L]'
                        ]
                    )
                ];
            }
        }
    },

    sass: {
        src: src + '/styles/**/*.{sass,scss,css}',
        dest: dest + '/styles',
        debug: isDev,
        settings: {
            indentedSyntax: false, // Enable .sass syntax?
            imagePath: '/images' // Used by the image-url helper
        },
        sourcemaps: {
            settings: {
                loadMaps: true
            },
            dest: './'
        },
        autoprefixer: {
            settings: {
                browsers: [
                    'last 2 versions'
                ],
                cascade: false
            }
        }
    },

    browserify: {
        settings: {
            transform: [
                'babelify',
                'reactify'
            ]
        },
        sourcemaps: {
            settings: {
                loadMaps: true
            },
            dest: './'
        },
        entries: src + '/js/index.jsx',
        dest: dest + '/js',
        outputName: 'index.js',
        debug: isDev
    },

    html: {
        src: 'src/index.html',
        dest: dest
    },

    watch: {
        src: ['src/**/*.*', '!src/js/__tests__/**/*.*'],
        watchers: [
            {
                src: ['src/js/**/*.{js,jsx}', '!src/js/__tests__/**/*.*'],
                tasks: ['browserify']
            },
            {
                src: 'src/styles/**/*.{sass,scss,css}',
                tasks: ['styles']
            },
            {
                src: 'src/**/*.html',
                tasks: ['html']
            },
            {
                src: 'src/img/**/*.*',
                tasks: ['images']
            }
        ]
    },

    fonts: {
        src: 'bower_components/font-awesome/fonts/*.*',
        dest: dest + '/fonts'
    },

    images: {
        src: 'src/img/*',
        dest: 'dist/img',
        settings: {
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }
    }
};
