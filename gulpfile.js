const { src, dest, series, parallel, watch } = require('gulp')
const htmlmin = require('gulp-htmlmin')
const cleancss = require('gulp-clean-css')
const concat = require('gulp-concat')
const terser = require("gulp-terser")
const imgmin = require("gulp-imagemin")
const gulp = require("gulp");
var rep = require('gulp-replace-image-src');
var htmlreplace = require('gulp-html-replace');

const glops = {
  html: "project/*.html",
  css: "project/*.css",
  js: "project/*.js",
  img: 'project/*.jpg',
}
function htmlTask() {
  return src(glops.html)
    .pipe(rep({
      prependSrc: '/images/',
      keepOrigin: false
    }))
    .pipe(htmlreplace({
      'css': 'assets/css/style.min.css',
      'js': 'assets/js/all.min.js'
    }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("dist"))
}

exports.html = htmlTask


function cssTask() {
  return src(glops.css)
    .pipe(concat("style.min.css"))
    .pipe(cleancss())
    .pipe(dest("dist/assets/css/"))
}

exports.css = cssTask


function jsTask() {
  return src(glops.js, { sourcemaps: true })
    .pipe(concat("script.min.js"))
    .pipe(terser())
    .pipe(dest("dist/assets/js/", { sourcemaps: '.' }))
}
exports.js = jsTask

function imgTask() {
  return gulp.src(glops.img)
    .pipe(imgmin())
    .pipe(gulp.dest("dist/images/"))
}
exports.img = imgTask

var browserSync = require('browser-sync');
function serve(cb) {
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}

function reloadTask(done) {
  browserSync.reload()
  done()
}


function watchTask() {
  watch(glops.html, series(htmlTask, reloadTask))
  watch(glops.css, series(cssTask, reloadTask))
  watch(glops.js, series(jsTask, reloadTask))
  watch(glops.img, series(imgTask, reloadTask));

}


exports.default = series(parallel(imgTask, htmlTask, cssTask, jsTask), serve, watchTask)



