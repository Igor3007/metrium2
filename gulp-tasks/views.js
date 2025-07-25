"use strict";

import {paths} from "./config.js";
import gulp from "gulp";
import pug from "gulp-pug";
import browserSync from "browser-sync";
import gulpData from "gulp-data";
import {readFileSync} from "fs";
import gulpHtmlClean from "gulp-htmlclean";

export const viewsDev = () => (
    gulp.src(paths.views.src)
        .pipe(gulpData((file) => (JSON.parse(readFileSync(paths.data.src)))))
        .pipe(pug())
        .pipe(gulp.dest(paths.views.dist))
        .pipe(browserSync.reload({stream: true}))
);

export const viewsProd = () => (
    gulp.src(paths.views.src)
        .pipe(gulpData((file) => (JSON.parse(readFileSync(paths.data.src)))))
        .pipe(pug({
            pretty: true
        }))
        // .pipe(gulpHtmlClean())
        .pipe(gulp.dest(paths.views.dist))
);

export const htmlTemplates = () => (
    gulp.src(paths.templates.src)
        .pipe(gulpData((file) => (JSON.parse(readFileSync(paths.data.src)))))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulpHtmlClean())
        .pipe(gulp.dest(paths.templates.dist))
);
