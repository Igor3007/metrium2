"use strict";

import {paths} from "./config.js";
import gulp from "gulp";
import imagemin, {mozjpeg,svgo} from "gulp-imagemin";
import imageminPngquant from "imagemin-pngquant";
import imageminZopfli from "imagemin-zopfli";
import browserSync from "browser-sync";

export const imagesDev = () => (
    gulp.src(paths.images.src, {encoding: false})
        .pipe(gulp.dest(paths.images.dist))
        .pipe(browserSync.reload({stream: true}))
);

export const imagesProd = () => (
    gulp.src(paths.images.src, {encoding: false})
        .pipe(imagemin([
            imageminPngquant({
                speed: 5,
                quality: [0.6, 0.8]
            }),
            imageminZopfli({
                more: true
            }),
            mozjpeg({
                progressive: true,
                quality: 90
            }),
            svgo({
                plugins: [
                    { name: "removeViewBox", active:" false"},
                    { name: "removeUnusedNS", active:" false"},
                    { name: "removeUselessStrokeAndFill", active:" false"},
                    { name: "cleanupIDs", active:" false"},
                    { name: "removeComments", active:" true"},
                    { name: "removeEmptyAttrs", active:" true"},
                    { name: "removeEmptyText", active:" true"},
                    { name: "collapseGroups", active:" true"}
                ]
            })
            ]))
);