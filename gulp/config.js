var dest = './dist';
var src = './src';
var gutil = require('gulp-util');

module.exports = {
    server: {
        settings: {
            root: dest,
            host: 'localhost',
            port: 8080,
            livereload: {
                port: 35929
            }
        }
    },

    sass: {
        src: src + '/styles/**/*.{sass,scss,css}',
        dest: dest + '/styles',
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
        debug: gutil.env.type === 'dev'
    },

    html: {
        src: 'src/index.html',
        dest: dest
    },

    watch: {
        src: ['src/**/*.*', '!src/js/__tests__/**/*.*'],
        tasks: ['build']
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
