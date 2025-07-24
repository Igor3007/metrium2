import gulp from "gulp";
import {paths} from "./config.js";
import browserSync from "browser-sync";

export const copyJSON = () => (
    gulp.src('./src/json/*.**')
        .pipe(gulp.dest('./dist/json/'))
        .pipe(browserSync.reload({stream: true}))
);

export const copyFonts = () => (
    gulp.src(paths.fonts.src, {encoding: false})
        .pipe(gulp.dest(paths.fonts.dist))
        .pipe(browserSync.reload({stream: true}))
);
