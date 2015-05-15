var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var hbsfy = require('hbsfy').configure({ extensions: ['handlebars'] });
var source = require('vinyl-source-stream');


gulp.task('bundle', function () {
  var bundle = browserify('./src/index.js')
      .transform(hbsfy)
      .transform(babelify)
      .bundle();

  return bundle
    .pipe(source('index.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch('./partials/*.handlebars', ['bundle']);
  gulp.watch('./src/*.js', ['bundle']);
});
