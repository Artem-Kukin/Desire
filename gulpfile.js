

const { src, dest, watch, parallel, series } = require('gulp');
const { reload }    = require('browser-sync');
const scss          = require('gulp-sass')(require('sass'));
const concat        = require('gulp-concat');
const browserSync   = require('browser-sync').create();
const uglify        = require('gulp-uglify-es').default;
const autoprefixer  = require('gulp-autoprefixer');
const clean         = require('gulp-clean');
const svgSprite     = require('gulp-svg-sprite');
const include       = require('gulp-include');

function pages() {
  return src('./app/pages/*.html')
        .pipe(include({
          includePaths: './app/components'
        }))
        .pipe(dest('./app'))
}

function sprite () {
  return src('./app/images/src/*.svg')
  .pipe(svgSprite({
    mode: {
      stack: {
        sprite: '../sprite.svg',
        example: true
      }
    }
  }))
  .pipe(dest('./app/images/dist'))
}


function scripts() {
  return src([
    './node_modules/jquery/dist/jquery.min.js',
    './app/js/main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream())

}

function styles() {
  return src('./app/scss/style.scss')
          .pipe(concat('style.min.css'))
          .pipe(scss({style: 'compressed'}))
          .pipe(autoprefixer({overrideBrowserslist: ['last 4 version']}))
          .pipe(dest('./app/css'))
          .pipe(browserSync.stream())
}

function watching() { 
  browserSync.init({ server: { baseDir: './app' } });
  watch(['./app/scss/*.scss'], styles);
  watch(['./app/components/*', './app/pages/*'], pages);
  watch(['./app/js/*.js','!./app/js/main.min.js'], scripts);
  watch('./app/**/*.html').on('change', browserSync.reload);
}

function cleanDist () {
  return src('dist')
  .pipe(clean()); 
};

function building() {
  return (src([    
'./app/css/style.min.css',
'./app/fonts/**/*',    
'./app/js/main.min.js',
'./app/*.html',    
'./app/images/dist/*.{png,jpg,jpeg,webp,svg,avif}',    
  ], {base: 'app'})
  .pipe(dest('dist'))

)
}

exports.styles    = styles;

exports.watching  = watching;

exports.scripts   = scripts;

exports.build     = series(cleanDist, building);

exports.cleanDist = cleanDist;

exports.building  = building;

exports.sprite    = sprite;

exports.pages     = pages;



exports.default   = parallel(scripts, pages, watching);



