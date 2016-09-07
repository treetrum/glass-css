var del = require("del");
var gulp = require("gulp");
var autoprefixer = require("gulp-autoprefixer");
var cssnano = require("gulp-cssnano");
var notify = require("gulp-notify");
var rename = require("gulp-rename");
var sass = require("gulp-ruby-sass");
var browserSync = require("browser-sync");
var sourcemaps = require("gulp-sourcemaps");

gulp.task('styles', function() {
    return sass('src/**/*.scss', { style: 'expanded' })
        .on('error', sass.logError)
        .pipe(sourcemaps.init())

        // Create & save expanded css
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist'))

        // Create & save minified css with sourcemaps
        .pipe(rename({suffix: '-min'}))
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))

        // Stream it to browserSync
        .pipe(browserSync.stream());
});

gulp.task('clean', function() {
    return del( ['dist'] );
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles');
});

gulp.task('watch', ['clean'], function() {

    // Build files before we start watching
    gulp.start('styles');

    // Watch .scss files
    gulp.watch('src/*.scss', ['styles']);

    // Watch HTML files for reloading purposes
    gulp.watch("**/*.html").on('change', browserSync.reload);

});

gulp.task('serve', function() {

    // Init server
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // Begin watching files
    gulp.start('watch');

});