import gulp  from 'gulp';
import babelify   from 'babelify';
import browserify from 'browserify';
import buffer     from 'vinyl-buffer';
import source     from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import stringify from 'stringify';
import browserSync from 'browser-sync';
import runSequence from 'run-sequence';
import babelConfig from './babelrc.json';

gulp.task('build:js', () =>
	browserify('app/app.js', { debug: true })
	.transform(stringify(['.html']))
	.transform(babelify, babelConfig)
	.bundle()
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('dist/'))
);

gulp.task('build:js-mock', () =>
	browserify('app-mock/app.js', { debug: true })
	.transform(stringify(['.html']))
	.transform(babelify, babelConfig)
	.bundle()
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('dist/'))
);

gulp.task('copy:html', () => 
	gulp.src(['app/index.html'])
    .pipe(gulp.dest('dist/'))
);

gulp.task('copy:html-mock', () => 
	gulp.src(['app-mock/index.html'])
    .pipe(gulp.dest('dist/'))
);

gulp.task('copy:json', () => 
	gulp.src(['mocks/**.*'])
    .pipe(gulp.dest('dist/'))
);

gulp.task('serve',() => {
	runSequence('build:js', 'copy:html', 'browser-sync', () => {
		gulp.watch(['app/**/*.js', 'app/**/*.html'], ['build:js', 'copy:html', browserSync.reload]);
	});
});

gulp.task('serve-mock',() => {
	runSequence('build:js-mock', 'copy:html-mock', 'copy:json', 'browser-sync', () => {
		gulp.watch(['app-mock/**/*.js', 'app-mock/**/*.json', 'app-mock/**/*.html'], ['build:js-mock', 'copy:html-mock','copy:json', browserSync.reload]);
	});
});

gulp.task('browser-sync', () => 
  browserSync({
    server: {
      baseDir: './dist'
    }
  })
);

gulp.task('default', ['serve']);

gulp.task('mock', ['serve-mock']);

