"use strict";

import gulp from "gulp";
import {paths} from "./gulp-tasks/config.js";
import {
    clean,
    copyFonts,
    copyJSON,
    jsDev,
    jsProd,
    stylesDev,
    stylesProd,
    viewsDev,
    viewsProd,
    favicons,
    imagesDev,
    webpDev,
    webpProd,
    spritesDev,
    spritesProd,
    htmlTemplates,
} from "./gulp-tasks/index.js";
import browserSync from "browser-sync";

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./dist/",
            port: 4000
        },
        notify: true,
    });
});

gulp.task('watch', function () {
    gulp.watch([paths.views.watch, paths.data.src], gulp.parallel(viewsDev));
    gulp.watch(paths.templates.watch, gulp.parallel(htmlTemplates));
    gulp.watch(paths.styles.watch, gulp.parallel(stylesDev));
    gulp.watch(paths.common.watch, gulp.parallel(jsDev));
    gulp.watch(paths.sprites.watch, gulp.parallel(spritesDev));
    gulp.watch(paths.images.watch, gulp.parallel(imagesDev));
    gulp.watch(paths.webp.watch, gulp.parallel(webpDev));
    gulp.watch(paths.fonts.watch, gulp.parallel(copyFonts));
    gulp.watch(paths.json.watch, gulp.parallel(copyJSON));
})

gulp.task(
    "default",
    gulp.series(
        clean,
        stylesDev,
        gulp.parallel(viewsDev, jsDev, copyFonts, copyJSON, favicons, imagesDev, webpDev, spritesDev, htmlTemplates),
        gulp.parallel('browser-sync', 'watch')
    )
);

gulp.task(
    "prod",
    gulp.series(
        clean,
        stylesProd,
        gulp.parallel(viewsProd, copyFonts, copyJSON, jsProd, favicons, imagesDev, webpProd, spritesProd, htmlTemplates)
    )
);
