"use strict";

import {paths} from "./config.js";
import gulp from "gulp";
import imageminWebp from "imagemin-webp";
import webp from "gulp-webp";
import browserSync from "browser-sync";

export const webpDev = () => (
    gulp.src(paths.webp.src, {encoding: false})
        .pipe(gulp.dest(paths.webp.dist))
        .pipe(webp(imageminWebp({
            lossless: true,
            quality: 80,
            alphaQuality: 100
        })))
        .pipe(gulp.dest(paths.webp.dist))
        .pipe(browserSync.reload({stream: true}))
);

export const webpProd = () => (
    gulp.src(paths.webp.src, {encoding: false})
        .pipe(webp(imageminWebp({
            lossless: true,
            quality: 80,
            alphaQuality: 100
        })))
        .pipe(gulp.dest(paths.webp.dist))
);