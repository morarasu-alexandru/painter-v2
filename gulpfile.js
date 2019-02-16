var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var multiDest = require('gulp-multi-dest');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var del = require('del');
var staticFiles = ['app/**/*', '!app/scss/**', '!app/js/**', '!app/css/**'];
var cssMultiDest = ['temp/css', 'app/css'];

gulp.task('startServer', () => {
    browserSync.init({
        server: {
            baseDir: 'temp'
        },
    });

    gulp.watch('app/scss/**/*.scss', gulp.series('compileScss'));
    gulp.watch('app/js/**/*.js', gulp.series('compileJs'));
    gulp.watch(staticFiles, gulp.series('compileStatics'));

    gulp.watch(['app/**/*', 'temp/js/**/*.js', '!app/**/*.scss', '!app/js/**/*.js']).on('change', browserSync.reload);
});

gulp.task('compileStatics', () => {
    return gulp.src(staticFiles)
        .pipe(gulp.dest('temp'))
});

gulp.task('compileScss', () => {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(multiDest(cssMultiDest))
});

gulp.task('compileJs', () => {
    return gulp.src('app/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            plugins: ['@babel/transform-runtime']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('temp/js'))
});

gulp.task('compileAll', gulp.parallel('compileStatics', 'compileScss', 'compileJs'));

gulp.task('clean:temp', () => {
    return del(['temp']);
});

gulp.task('serve', gulp.series('compileAll', 'startServer'));