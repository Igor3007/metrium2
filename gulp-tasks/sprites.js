"use strict";

import {paths} from "./config.js";
import gulp from "gulp";
import svg from "gulp-svg-sprite";
import browserSync from "browser-sync";

export const spritesDev = () => (
    gulp.src(paths.sprites.src)
        .pipe(svg({
            shape: {
                dest: "intermediate-svg"
            },
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest(paths.sprites.dist))
        .pipe(browserSync.reload({stream: true}))
);

export const spritesProd = () => (
    gulp.src(paths.sprites.src)
        .pipe(svg({
            shape: {
                dest: "intermediate-svg"
            },
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest(paths.sprites.dist))
);
