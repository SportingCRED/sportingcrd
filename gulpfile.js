/*
* Add your variables here
*
*/
var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    jshint = require('gulp-jshint'),
    modernizr = require('gulp-modernizr'),
    imagemin = require('gulp-imagemin');
    cache = require('gulp-cache');
    browserSync = require('browser-sync').create();


var env = process.env.NODE_ENV || 'development';
var outputDir = './';
var inputDir = './pre-build/';


gulp.task('jshint', function() {
	return gulp.src(inputDir + 'js/**/**/*.js')
    .pipe(plumber())
	  .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('modernizr', function() {
  return gulp.src(inputDir + 'js/**/**/*.js')
    .pipe(plumber())
    .pipe(modernizr())
    .pipe(gulp.dest(outputDir + 'modernizr'))
});

gulp.task('js', function() {
	return gulp.src(inputDir + 'js/**/**/*.js')
  .pipe(plumber())
	.pipe(browserify( { debug: env === 'development'} ))
	.pipe(gulpif(env === 'production', uglify()))
	.pipe(gulp.dest(outputDir + 'js'))
});


gulp.task('sass', function() {
    var config = {};
	if (env === 'development') {
		config.sourceComments = 'map';
	}
	if (env === 'production') {
		config.outputStyle = 'compressed';
	}
    return gulp.src(inputDir + 'sass/main.scss')
    .pipe(plumber())
	.pipe(sass(config))
	.pipe(gulp.dest(outputDir + 'css'))
});

gulp.task('watch', function() {
  gulp.watch(inputDir + 'js/**/**/*.js', ['js']);
  gulp.watch(inputDir + 'sass/**/**/*.scss', ['sass']);
  gulp.watch(inputDir + 'images/**/**/*.+(png|jpg|jpeg|gif|svg|ico)', ['images']);
  gulp.watch(inputDir + 'fonts/**/**/*', ['fonts']);
});

gulp.task('images', function(){
  return gulp.src(inputDir + 'images/**/**/*.+(png|jpg|jpeg|gif|svg|ico)')
  .pipe(plumber())
  .pipe(cache(imagemin({ interlaced: true })))
  .pipe(gulp.dest(outputDir + 'img'))
});

gulp.task('fonts', function() {
  return gulp.src(inputDir + 'fonts/**/**/*')
  .pipe(plumber())
  .pipe(gulp.dest(outputDir + 'fonts'))
})

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: outputDir
    });
    gulp.watch(outputDir + "gulpfile.js").on('change', browserSync.reload);
    gulp.watch(outputDir + "css/**/*.css").on('change', browserSync.reload);
    gulp.watch(outputDir + "**/**/*.html").on('change', browserSync.reload);
    gulp.watch(outputDir + "js/**/**/*.js").on('change', browserSync.reload);
    gulp.watch(outputDir + 'img/**/**/*.+(png|jpg|jpeg|gif|svg|ico)').on('change', browserSync.reload);
    gulp.watch(outputDir + 'fonts/**/**/*').on('change', browserSync.reload);
});

/*
*  Gulp Task "default"
*
*/

gulp.task('default', ['watch', 'serve']);
