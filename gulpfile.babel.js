import gulp  from 'gulp';
import babelify   from 'babelify';
import browserify from 'browserify';
import buffer     from 'vinyl-buffer';
import source     from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import stringify from 'stringify';
import browserSync from 'browser-sync';
import gutil from 'gulp-util';
import runSequence from 'run-sequence';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import htmlmin from 'gulp-htmlmin';

gulp.task('build:pug', () =>
	gulp.src('examples/pug/index.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(htmlmin())
    .pipe(gulp.dest('dist/pug'))
);

gulp.task('build:js', () =>
	browserify(['examples/request/app.js'], { debug: true })
	.transform(stringify(['.html']))
	.transform(babelify)
	.bundle()
	.on('error', function (err) { gutil.log(err.toString()); this.emit('end'); })
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('dist/request'))
);

gulp.task('build:js-mock', () =>
	browserify(['examples/mock/app.js'], { debug: true })
	.transform(stringify(['.html']))
	.transform(babelify)
	.bundle()
	.on('error', function (err) { gutil.log(err.toString()); this.emit('end'); })
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('dist/mock'))
);

gulp.task('build:js-pug', () =>
	browserify(['examples/pug/app.js'], { debug: true })
	.transform(stringify(['.html']))
	.transform(babelify)
	.bundle()
	.on('error', function (err) { gutil.log(err.toString()); this.emit('end'); })
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('dist/pug'))
);

gulp.task('build:js-min', () =>
	browserify(['examples/request/app.js'])
	.transform(stringify(['.html']))
	.transform(babelify)
	.bundle()
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest('docs/'))
);

gulp.task('build:js-build', () =>
	browserify(['src/table.js'])
	.transform(stringify(['.html']))
	.transform(babelify)
	.bundle()
	.pipe(source('pyrite-table.min.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest('build/'))
);

gulp.task('copy:html', () =>
	gulp.src(['examples/request/index.html'])
    .pipe(gulp.dest('dist/request'))
);

gulp.task('copy:html-mock', () =>
	gulp.src(['examples/mock/index.html'])
    .pipe(gulp.dest('dist/mock'))
);

gulp.task('copy:html-docs', () =>
	gulp.src(['examples/request/index.html'])
    .pipe(gulp.dest('docs/'))
);

gulp.task('serve',() => {
	runSequence('build:js', 'copy:html', 'browser-sync', () => {
		gulp.watch(['examples/request/**/**.*', 'src/**/**.*'], ['build:js', 'copy:html', browserSync.reload]);
	});
});

gulp.task('serve-pug',() => {
	runSequence('build:pug', 'build:js-pug', 'browser-sync-pug', () => {
		gulp.watch(['examples/pug/**/**.*', 'src/**/**.*'], ['build:pug', 'build:js-pug', browserSync.reload]);
	});
});

gulp.task('serve-mock',() => {
	runSequence('build:js-mock', 'copy:html-mock', 'browser-sync-mock', () => {
		gulp.watch(['examples/mock/**/**.*', 'src/**/**.*'], ['build:js-mock', 'copy:html-mock', browserSync.reload]);
	});
});

gulp.task('docs',() => {
	runSequence('build:js-min', 'copy:html-docs');
});

gulp.task('browser-sync', () =>
  browserSync({
    server: {
      baseDir: './dist/request'
    }
  })
);

gulp.task('browser-sync-mock', () =>
  browserSync({
    server: {
      baseDir: './dist/mock'
    }
  })
);

gulp.task('browser-sync-pug', () =>
  browserSync({
    server: {
      baseDir: './dist/pug'
    }
  })
);

gulp.task('default', ['serve']);

gulp.task('pug', ['serve-pug']);

gulp.task('build', ['build:js-build']);

gulp.task('mock', ['serve-mock']);
