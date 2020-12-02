const {src, dest, watch, series, parallel} = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const $ = loadPlugins();
const pkg = require('./package.json');
// const conf = pkg["gulp-config"];
// const sizes = conf.sizes;
const browserSync = require('browser-sync');
const server = browserSync.create();
const del = require('del');
const browserSyncOption = {
  port: 8080,
  server: {
    baseDir: './dist',
    index: 'index.html'
  }
}

function clean() {
  return del(['dist/**/']);
}

function move() {
  return src(['./src/assets/**'])
  .pipe(dest('./dist/assets/'));
}

function ejs() {
  return src(['./src/ejs/**/*.ejs', '!' + './src/ejs/**/_*.ejs'])
  .pipe($.ejs())
  .pipe($.rename({
    extname: '.html'
  }))
  .pipe(dest('./dist'));
}

function styles() {
  return src('./src/sass/**/*.scss', '!' + './src/sass/**/_*.scss')
  .pipe($.sourcemaps.init())
  .pipe($.sass({
    includePaths: require('node-reset-scss').includePath,
    outputStyle: 'expanded'
  })).on('error', $.sass.logError)
  .pipe($.autoprefixer({
    cascade: false
  }))
  .pipe($.sourcemaps.write('.'))
  .pipe(dest('./dist/assets/css'));
}

function startAppServer() {
  server.init(browserSyncOption);
  watch('./src/sass/**/*.scss', styles);
  watch('./src/ejs/**/*.ejs', ejs);
  watch('./src/sass/**/*.scss').on('change', server.reload);
  watch('./src/ejs/**/*.ejs').on('change', server.reload);
}

exports.clean = clean;
exports.move = move;
exports.styles = styles;
exports.ejs = ejs;
const serve = series(parallel(clean, ejs, styles, move, startAppServer));
exports.serve = serve;
