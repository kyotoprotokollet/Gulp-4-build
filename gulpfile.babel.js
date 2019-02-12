"use strict";
import { src, dest, watch, series, parallel } from 'gulp';
import webpack from 'webpack-stream';
import yargs from 'yargs'
import del from 'del';
import gulpif from 'gulp-if';
import sass from 'gulp-sass';
import imagemin from 'gulp-imagemin';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import browserSync from "browser-sync";
const PRODUCTION = yargs.argv.prod;

const paths = {
    "css": 'public/dist/css',
    "js": 'public/dist/js',
    "images": "public/dist/images"
}

// Remove everything from the dist-folder
function clean() {
    return del(["public/dist/*"]);
}

// Compile SCSS, add sourcemaps, minify etc.
export const styles = () => {
    return src("source/scss/styles.scss")
        .pipe(plumber())
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(PRODUCTION, autoprefixer({
            browsers: ['last 2 versions']
        })))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(gulpif(PRODUCTION, cleanCss({ compatibility: '*' })))
        .pipe(gulpif(PRODUCTION, rename({ suffix: ".min" })))
        .pipe(dest(paths.css))
}

// Transpile ES6 to ES5. Bundle modules.
export const scripts = () => {
    return src('source/js/app.js')
    .pipe(webpack({
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: []
              }
            }
          }
        ]
      },
      mode: PRODUCTION ? 'production' : 'development',
      devtool: !PRODUCTION ? 'inline-source-map' : false,
      output: {
        filename: 'app.js'
      },
    }))
    .pipe(dest(paths.js))
}

export const images = () => {
    return src('source/images/**/*.{jpg,jpeg,png,svg,gif}')
        .pipe(gulpif(PRODUCTION, imagemin()))
        .pipe(dest(paths.images));
}

export const monitor = () => {
    watch('source/scss/**/*.scss', styles);
    watch('source/js/**/*.js', scripts);
    watch('source/images/**/*.{jpg,jpeg,png,svg,gif}', images);
}

export const dev = series(clean, parallel(styles, images, scripts), monitor)
export const build = series(clean, parallel(styles, images, scripts))