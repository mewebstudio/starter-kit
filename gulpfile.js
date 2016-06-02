var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    cssshrink = require('gulp-cssshrink'),
    cp = require('child_process'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    size = require('gulp-size');

var styles = [
    'src/sass/app.scss'
];
gulp.task('styles', function() {
    gulp.src(styles)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.reload({stream:true}));
});

var scripts = [
    'src/vendor/jquery/dist/jquery.min.js',
    'src/vendor/jquery.easing/js/jquery.easing.min.js',
    'src/vendor/jquery.easing/js/jquery.easing.compatibility.js',
    'src/vendor/jquery.cookie/js/jquery.cookie.js',
    'src/vendor/jquery-hoverintent/jquery.hoverIntent.js',
    'src/vendor/jquery-ui/jquery-ui.min.js',
    'src/js/**/*.js'
];
gulp.task('scripts', function() {
    return gulp.src(scripts)
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('images', function () {
    return gulp.src('src/img/**')
        .pipe(changed('dist/assets/img'))
        .pipe(imagemin({
            // Lossless conversion to progressive JPGs
            progressive: true,
            // Interlace GIFs for progressive rendering
            interlaced: true
        }))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(size({title: 'images'}));
});

var fonts = [
    'src/vendor/bootstrap-sass/assets/fonts/bootstrap/**',
    'src/vendor/font-awesome/fonts/**'
];
gulp.task('fonts', function () {
    return gulp.src(fonts)
        .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('html', function() {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist/'))
});

gulp.task('browser-sync', ['styles', 'scripts'], function() {
    browserSync({
        server: {
            baseDir: "dist/",
            injectChanges: true
        }
    });
});

gulp.task('watch', function() {
    // Watch .html files
    gulp.watch('src/*.html', ['html', browserSync.reload]);
    gulp.watch("src/*.html").on('change', browserSync.reload);
    // Watch .sass files
    gulp.watch('src/sass/**/*.scss', ['styles', browserSync.reload]);
    // Watch .js files
    gulp.watch('src/js/*.js', ['scripts', browserSync.reload]);
    // Watch image files
    gulp.watch('src/img/**/*', ['images', browserSync.reload]);
});

gulp.task('default', function() {
    gulp.start('styles', 'scripts', 'images', 'fonts', 'html', 'browser-sync', 'watch');
});
