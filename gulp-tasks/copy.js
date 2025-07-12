import gulp from "gulp";
import {paths} from "./config.js";

export const copyJSON = () => (
    gulp.src('./src/json/*.**')
        .pipe(gulp.dest('./dist/json/'))
);

export const copyFonts = () => (
    gulp.src(paths.fonts.src, {encoding: false})
        .pipe(gulp.dest(paths.fonts.dist))
);