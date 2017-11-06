var gulp = require('gulp');
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');



// 压缩css文件
gulp.task('minify-css', function() {
    return gulp.src('./_web/**/*.css')
        .pipe(cleancss())
        .pipe(gulp.dest('./_web'));
});
// 压缩html文件
gulp.task('minify-html', function() {
    return gulp.src('./_web/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
            removeComments: true,
            minifyJS: true,
            cleancss: true,
            minifyURLs: true,
        }))
        .pipe(gulp.dest('./_web'))
});
// 压缩js文件
gulp.task('minify-js', function() {
    return gulp.src('./_web/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./_web'));
});

// 合并js文件
gulp.task('concat-js', function() {
    return gulp.src('./_web/**/*.js')
        .pipe(concat('all.js')) //合并后的文件名
        .pipe(gulp.dest('./_web'));
});

// 压缩 _web/demo 目录内图片
gulp.task('minify-images', function() {
    gulp.src('./_web/demo/**/*.*')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: false, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: false, //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('./_web/uploads'));
});
// 默认任务
gulp.task('default', [
    'minify-html',
    'minify-css',
    'minify-js',
    'minify-images'
]);