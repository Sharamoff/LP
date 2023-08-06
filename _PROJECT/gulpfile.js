'use strict';

const
	gulp = require('gulp'),
	sass = require('gulp-sass')(require('sass')),
	plumber = require('gulp-plumber'),
	prefixer = require('gulp-autoprefixer'),
	rimraf = require('rimraf'),
	browserSync = require("browser-sync"),
	cache = require('gulp-cache'),
	reload = browserSync.reload;

const path = {
	build: {
		html:   'BUILD/',
		js:     'BUILD/assets/',
		css:    'BUILD/assets/',
		img:    'BUILD/assets/img/'
	},
	src: {
		html:   'SRC/*.html',
		js:     'SRC/assets/*.js',
		style:  'SRC/assets/*.scss',
		img:    'SRC/assets/img/**/*.*'
	},
	watch: {
		html:   'SRC/**/*.html',
		js:     'SRC/assets/*.js',
		style:  'SRC/assets/*.scss',
		img:    'SRC/assets/img/**/*.*'
	},
	clean: './build'
};

const config = {
	server: {
		baseDir: "./build"
	},
	tunnel: false,
	host: 'localhost',
	port: 3000,
	logPrefix: "LP"
};

gulp.task('html:build', function(done) {
	return gulp.src(path.src.html)
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
	done();
});

gulp.task('js:build', function(done) {
	return gulp.src(path.src.js)
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
	done();
});

gulp.task('style:build', function(done) {
	return gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(sass({
			sourceMap: false,
			errLogToConsole: true
		}))
		.pipe(prefixer())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
	done();
});

gulp.task('image:build', function(done) {
	return gulp.src(path.src.img)
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
	done();
});

gulp.task('build', gulp.parallel(
	'html:build',
	'js:build',
	'style:build',
	'image:build'
	)
);


gulp.task('watch', function(done) {
	gulp.watch(path.watch.html,		gulp.series('html:build'));
	gulp.watch(path.watch.js,			gulp.series('js:build'));
	gulp.watch(path.watch.style,	gulp.series('style:build'));
	gulp.watch(path.watch.img, 		gulp.series('image:build'));
	done();
});


gulp.task('webserver', function(done) {
	browserSync.init(config);
	done();
});


gulp.task('clean', function(cb) {
	rimraf(path.clean, cb);
});


gulp.task('default', gulp.series('build', 'webserver', 'watch'));