"use strict";

import gulp from "gulp";
import rollup from "@rollup/stream";
import {nodeResolve} from "@rollup/plugin-node-resolve";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import gulpSrcMap from "gulp-sourcemaps";
import gulpTerser from "gulp-terser";
import {paths} from "./config.js";
import browserSync from "browser-sync";

let cache;

export const jsDev = () => (
    rollup({
        input: paths.scripts.src,
        plugins: [nodeResolve()],
        cache: cache,
        output: {
            format: 'iife'
        }
    })
        .on('bundle', function (bundle) {
            cache = bundle;
        })
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(gulpSrcMap.init({loadMaps: true}))
        .pipe(gulpSrcMap.write('.'))
        .pipe(gulp.dest(paths.scripts.dist))
        .pipe(browserSync.reload({stream: true}))
);

export const jsProd = () => (
    rollup({
        input: paths.scripts.src,
        plugins: [nodeResolve()],
        cache: cache,
        output: {
            format: 'iife'
        }
    })
        .on('bundle', function (bundle) {
            cache = bundle;
        })
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(gulpTerser({format: {comments: false}}))
        .pipe(gulp.dest(paths.scripts.dist))
);
