var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');


gulp.task('bundle', function () {
  var bundle = browserify('./src/index.js')
      .transform(babelify)
      .bundle();

  return bundle
    .pipe(source('index.js'))
    .pipe(gulp.dest('./dist'));
});
