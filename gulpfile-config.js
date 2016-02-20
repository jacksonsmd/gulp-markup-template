'use strict';

const base = {
	assets     : './assets/',
	production : './public/'
};

const config = {
	assets: {
		html    : '' + base.assets + 'templates/**/*.html',
		sass    : '' + base.assets + 'styles/style.scss',
		icon    : '' + base.assets + 'icons/*.svg',
		scripts : '' + base.assets + 'scripts/**/*.js',
		images  : '' + base.assets + 'images/**/*.*'
	},
	watch: {
		html    : '' + base.assets + 'templates/**/*.html',
		sass    : '' + base.assets + 'styles/**/*.scss',
		icon    : '' + base.assets + 'icons/*.svg',
		scripts : '' + base.assets + 'scripts/**/*.js',
		images  : '' + base.assets + 'images/**/*.*'
	},
	watchResolve: {
		html    : '' + base.assets + 'templates',
		scripts : '' + base.assets + 'scripts',
		images  : '' + base.assets + 'images'
	},
	production: {
		html    : '' + base.production + '',
		css     : '' + base.production + 'css/',
		icon    : '' + base.production + 'fonts/',
		scripts : '' + base.production + 'js/',
		images  : '' + base.production + 'images/'
	}
};

module.exports = config;