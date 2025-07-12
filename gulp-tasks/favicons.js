"use strict";

import {paths} from "./config.js";
import gulp from "gulp";
import g_favicons from "gulp-favicons";


export const favicons = async () => (
    await gulp.src(paths.favicons.src, {encoding: false})
        .pipe(g_favicons({
            icons: {
                appleIcon: true,
                favicons: true,
                online: false,
                appleStartup: false,
                android: false,
                firefox: false,
                yandex: false,
                windows: false,
                coast: false
            }
        }))
        .pipe(gulp.dest(paths.favicons.dist))
);