"use strict";

import browserSync from "browser-sync";
import cssNano from "gulp-cssnano";
import gulp from 'gulp';
import gulpReplace from "gulp-replace";
import autoprefixer from 'autoprefixer';
import gulpSrcMap from "gulp-sourcemaps";
import postcss from 'gulp-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import sortMediaQueries from 'postcss-sort-media-queries';
import {paths} from "./config.js";

import * as _Sass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(_Sass);

export const stylesDev = () => (
    gulp.src(paths.styles.src)
        .pipe(gulpSrcMap.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer(),
            postcssPresetEnv(),
            sortMediaQueries({sort:'mobile-first'})
        ]))
        .pipe(cssNano())
        .pipe(gulpSrcMap.write())
        .pipe(gulp.dest(paths.styles.dist))
        .pipe(browserSync.reload({stream: true}))
);

export const stylesProd = () => (
    gulp.src(paths.styles.src)
        .pipe(sass())
        .pipe(postcss([
            autoprefixer(),
            postcssPresetEnv(),
            sortMediaQueries({sort:'mobile-first'})
        ]))
        .pipe(gulpReplace("/*!","/*"))
        .pipe(cssNano())
        .pipe(gulp.dest(paths.styles.dist))
);