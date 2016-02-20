'use strict';

const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const delt = require('del');
const cssbeautify = require('gulp-cssbeautify');
const autoprefixer = require('gulp-autoprefixer');
const imageop = require('gulp-image-optimization');
const sourcemaps = require('gulp-sourcemaps');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const browserSync = require('browser-sync').create();
const config = require('./gulpfile-config');

gulp.task('server', function() {
	browserSync.init({
		server: config.production.html,
		directory: true
	});

	browserSync.watch(config.production.html + '**/*.*').on('change', browserSync.reload);
});

gulp.task('sass', function () {
	return gulp.src(config.assets.sass)
			.pipe(sourcemaps.init())
			.pipe(sass().on('error', sass.logError))
			.pipe(autoprefixer({
				browsers: ['last 6 versions'],
				cascade: false
			}))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(config.production.css));
});

gulp.task('css:beautify', function() {
	return gulp.src(config.production.css + 'style.css')
			.pipe(cssbeautify())
			.pipe(gulp.dest(config.production.css));
});

gulp.task('icons', function() {
	return gulp.src([config.assets.icon], { base: './assets/' })
			.pipe(iconfontCss({
				fontName: 'icons',
				targetPath: '../../assets/styles/fonts/icons.scss',
				fontPath: '../fonts/',
				cssClass: 'icon'
			}))
			.pipe(iconfont({
				fontName: 'icons',
				fontHeight: 1001,
				normalize: true,
				centerHorizontally: true
			}))
			.pipe(gulp.dest(config.production.icon));
});

gulp.task('scripts', function() {
	return gulp.src(config.assets.scripts)
			.pipe(gulp.dest(config.production.scripts));
});

gulp.task('images:copy', function() {
	return gulp.src(config.assets.images)
			.pipe(gulp.dest(config.production.images));
});

gulp.task('images:optimize', function() {
	return gulp.src(config.production.images + '**/*.*')
			.pipe(imageop({
				optimizationLevel: 10,
				progressive: true,
				interlaced: true
			}))
			.pipe(gulp.dest(config.production.images));
});

gulp.task('template', function() {
	return gulp.src(config.assets.html)
			.pipe(gulp.dest(config.production.html));
});

// watch
gulp.task('watch', function() {
	gulp.watch(config.watch.sass, gulp.series('sass'));
	gulp.watch(config.watch.icon, gulp.series('icons', 'sass'));
	watchChangesFiles(config.assets.html, config.production.html, config.watchResolve.html, 'template');
	watchChangesFiles(config.assets.images, config.production.images, config.watchResolve.images, 'images:copy');
	watchChangesFiles(config.assets.scripts, config.production.scripts, config.watchResolve.scripts, 'scripts');
});

// tasks
gulp.task('build', gulp.series('template', 'scripts', 'icons', 'sass', 'images:copy'));
gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'server')));
gulp.task('server', gulp.parallel('watch', 'server'));
gulp.task('dist', gulp.series('css:beautify', 'images:optimize'));

// watch changes files
function watchChangesFiles(assetsPath, publicPath, watchResolve, taskName) {
	let watch = gulp.watch(assetsPath, gulp.series(taskName));
	let filePathFromSrc; 
	let destFilePath;

	watch.on('unlink', function (filepath) {
		filePathFromSrc = path.relative(path.resolve(watchResolve), filepath);
		destFilePath = path.resolve(publicPath, filePathFromSrc);

		delt.sync(destFilePath);
	});
}