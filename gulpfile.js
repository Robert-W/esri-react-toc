var browserSync = require('browser-sync');
var gulp = require('gulp');

var FILES = ['build/**/*.html', 'build/**/*.js', 'build/**/*.css'];
var PORT = process.env.PORT || 3000;
var BASE_DIR = 'build';

var COPY_SRC = 'src/**.*{html,css}';

gulp.task('copy', function () {
  return gulp.src(COPY_SRC)
    .pipe(gulp.dest('build'));
});

gulp.task('copy-watch', function () {
  gulp.watch(COPY_SRC, ['copy']);
});

gulp.task('browser-sync', function () {
  var useHttps = process.env.SERVER === 'https';

  browserSync({
    server: BASE_DIR,
    files: FILES,
    port: PORT,
    reloadOnRestart: false,
    logFileChanges: false,
    ghostMode: false,
    https: useHttps,
    open: false,
    ui: false
  });
});

gulp.task('start', ['copy-watch', 'browser-sync']);
