"use strict";

import {paths} from "./config.js";
import gulp from "gulp";
import pug from "gulp-pug";
import replace from "gulp-replace";
import browserSync from "browser-sync";
// import gulpHtmlClean from "gulp-htmlclean";

export const viewsDev = () => (
    gulp.src(paths.views.src)
        .pipe(pug())
        .pipe(gulp.dest(paths.views.dist))
        .pipe(browserSync.reload({stream: true}))
);

export const viewsProd = () => (
    gulp.src(paths.views.src)
        .pipe(pug({
            pretty: true
        }))
        // .pipe(replace(".css", ".min.css"))
        // .pipe(replace(".js", ".min.js"))
        // .pipe(gulpHtmlClean())
        .pipe(gulp.dest(paths.views.dist))
);