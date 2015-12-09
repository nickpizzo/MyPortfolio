import gulp from 'gulp';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import browserSync from 'browser-sync';
import less from 'gulp-less';
import ghPages from 'gh-pages';
import gutil from 'gulp-util';
import imagemin from 'gulp-imagemin';

const sync = browserSync.create();

gulp.task('html', () => {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(sync.reload({
      stream: true
    }));
    gulp.src('src/CNAME').pipe(gulp.dest('dist'))
});

gulp.task('script', () => {
  gulp.src('src/scripts/*.js')
    .pipe(gulp.dest('dist/scripts'))
    .pipe(sync.reload({
      stream: true
    }));
});

gulp.task('styles', () => {
  gulp.src('src/styles/**/*.{css,less}')
  .pipe(less()
  .on('error', (error) => {
    gutil.log(gutil.colors.red('Error: ' + error.message));
    gutil.beep();
  }))
  .pipe(gulp.dest('dist/styles'))
  .pipe(sync.reload({
    stream: true
  }));
});

gulp.task('images', () => {
  gulp.src('src/styles/images/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/images'))
});

gulp.task('build', ['html', 'script', 'styles', 'images']);

gulp.task("deploy", ["build"], () => {
  ghPages.publish("dist");
});

gulp.task('serve', ['build'], () => {
  sync.init({
    server: 'dist',
  });

  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.{css,scss,less}', ['styles']);
  gulp.watch('src/scripts/*.js', ['script']);
  gulp.watch('src/styles/images/*', ['images']);
});

gulp.task('default', ['serve']);
