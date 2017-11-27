/*  npm install 超时请使用：(两条命令在当前文件目录下执行)

   npm config set registry https://registry.npm.taobao.org
   npm install

   或者：

   npm install -g cnpm --registry=https://registry.npm.taobao.org
   cnpm install
*/

var gulp = require('gulp');
var debug = require('gulp-debug');
var cleancss = require('gulp-clean-css');   //css压缩组件
var cssversion = require('gulp-make-css-url-version');   //css资源添加版本号
var uglify = require('gulp-uglify');        //js压缩组件
var htmlmin = require('gulp-htmlmin');      //html压缩组件
var htmlclean = require('gulp-htmlclean');  //html清理组件
var assetRev = require('gulp-asset-rev');   //版本控制插件
var runSequence = require('run-sequence');  //异步执行组件
var changed = require('gulp-changed');      //文件更改校验组件
var gulpif = require('gulp-if')             //任务 帮助调用组件
var plumber = require('gulp-plumber');      //容错组件（发生错误不跳出任务，并报出错误内容）

var isScriptAll = true;     //是否处理所有文件，(true|处理所有文件)(false|只处理有更改的文件)
var isDebug = true;         //是否调试显示 编译通过的文件


// 压缩js文件
gulp.task('compressJs', function () {
    var option = {
        // preserveComments: 'all',//保留所有注释
        mangle: true,           //类型：Boolean 默认：true 是否修改变量名
        compress: true          //类型：Boolean 默认：true 是否完全压缩
    }
    return gulp.src(['./_Web/**/*.js','!./_Web/**/*.min.js'])  //排除的js
        .pipe(gulpif(!isScriptAll, changed('./_Web')))
        .pipe(gulpif(isDebug,debug({title: 'Compress JS:'})))
        .pipe(plumber())
        .pipe(uglify(option))                //调用压缩组件方法uglify(),对合并的文件进行压缩
        .pipe(gulp.dest('./_Web'));         //输出到目标目录
});


// 压缩css文件
gulp.task('compressCss', function () {
    return gulp.src('./_Web/**/*.css')
        .pipe(gulpif(!isScriptAll, changed('./_Web')))
        .pipe(gulpif(isDebug,debug({title: 'Compress CSS:'})))
        .pipe(plumber())
        .pipe(cleancss({rebase: false}))
        .pipe(gulp.dest('./_Web'));
});


// 压缩html文件
gulp.task('compressHtml', function () {
    var cleanOptions = {
        protect: /<\!--%fooTemplate\b.*?%-->/g,             //忽略处理
        unprotect: /<script [^>]*\btype="text\/x-handlebars-template"[\s\S]+?<\/script>/ig //特殊处理
    }
    var minOption = {
        collapseWhitespace: true,           //压缩HTML
        collapseBooleanAttributes: true,    //省略布尔属性的值  <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,        //删除所有空格作属性值    <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,   //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        removeComments: true,               //清除HTML注释
        minifyJS: true,                     //压缩页面JS
        minifyCSS: true,                    //压缩页面CSS
        minifyURLs: true                    //替换页面URL
    };
    return gulp.src('./_Web/**/*.html')
        .pipe(gulpif(isDebug,debug({title: 'Compress HTML:'})))
        .pipe(plumber())
        .pipe(htmlclean(cleanOptions))
        .pipe(htmlmin(minOption))
        .pipe(gulp.dest('./_Web'));
});


// 合并js文件
gulp.task('concat-js', function() {
    return gulp.src(['./_Web/**/*.js','!./_Web/**/*.min.js'])
        .pipe(concat('all.js')) //合并后的文件名
        .pipe(gulp.dest('./_Web'));
});

// 压缩 _Web/demo 目录内图片
gulp.task('compressImages', function() {
    gulp.src('./_Web/demo/**/*.*')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: false, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: false, //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('./_Web/uploads'));
});

// 默认任务
gulp.task('default', function () {
    runSequence.options.ignoreUndefinedTasks = true;
    runSequence('compressHtml','compressCss','compressJs');
});
