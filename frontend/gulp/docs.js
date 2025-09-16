const gulp = require("gulp");
const fs = require("fs");
const clean = require("gulp-clean");

// HTML
const fileInclude = require("gulp-file-include");
const htmlclean = require("gulp-htmlclean");
const webpHTML = require("gulp-webp-html");

// SASS
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const webpCss = require("gulp-webp-css");

const server = require("gulp-server-livereload");
const sourceMaps = require("gulp-sourcemaps");
const groupMedia = require("gulp-group-css-media-queries");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const webpack = require("webpack-stream");
const babel = require("gulp-babel");
const changed = require("gulp-changed");

// Images
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");

const tap = require("gulp-tap");

// Путь к корневой папке docs (на уровень выше frontend)
const ROOT_DOCS_PATH = "../docs/";

// Задача очистки
gulp.task("clean:docs", function (done) {
  if (fs.existsSync(ROOT_DOCS_PATH)) {
    return gulp
      .src(ROOT_DOCS_PATH, { read: false })
      .pipe(clean({ force: true }));
  }
  done();
});

const fileIncludeSetting = {
  prefix: "@@",
  basepath: "@file",
  context: {},
  indent: true,
  flatten: false,
  interpolate: false,
};

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: "Error <%= error.message %>",
      sound: false,
    }),
  };
};

gulp.task("html:docs", function () {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(changed(ROOT_DOCS_PATH))
    .pipe(plumber(plumberNotify("HTML")))
    .pipe(
      tap((file) => {
        console.log("🔍 [DEBUG] Processing:", file.relative);
      })
    )
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(webpHTML())
    .pipe(htmlclean())
    .pipe(gulp.dest(ROOT_DOCS_PATH));
});

gulp.task("sass:docs", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(changed(ROOT_DOCS_PATH + "css/"))
    .pipe(plumber(plumberNotify("SCSS")))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(webpCss())
    .pipe(groupMedia())
    .pipe(sass())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(ROOT_DOCS_PATH + "css/"));
});

gulp.task("images:docs", function () {
  return gulp
    .src("./src/img/**/*")
    .pipe(changed(ROOT_DOCS_PATH + "img/"))
    .pipe(webp())
    .pipe(gulp.dest(ROOT_DOCS_PATH + "img/"))
    .pipe(gulp.src("./src/img/**/*"))
    .pipe(changed(ROOT_DOCS_PATH + "img/"))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest(ROOT_DOCS_PATH + "img/"));
});

gulp.task("fonts:docs", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed(ROOT_DOCS_PATH + "fonts/"))
    .pipe(gulp.dest(ROOT_DOCS_PATH + "fonts/"));
});

gulp.task("files:docs", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed(ROOT_DOCS_PATH + "files/"))
    .pipe(gulp.dest(ROOT_DOCS_PATH + "files/"));
});

gulp.task("js:docs", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed(ROOT_DOCS_PATH + "js/"))
    .pipe(plumber(plumberNotify("JS")))
    .pipe(babel())
    .pipe(webpack(require("./../webpack.config.js")))
    .pipe(gulp.dest(ROOT_DOCS_PATH + "js/"));
});

const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task("server:docs", function () {
  return gulp.src(ROOT_DOCS_PATH).pipe(server(serverOptions));
});
