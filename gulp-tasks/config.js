export const paths = {
    views: {
        src: [
            "./src/views/index.pug",
            "./src/views/pages/**/*.pug",
        ],
        dist: "./dist/",
        watch: [
            "./src/blocks/**/*.pug",
            "./src/data/**/*.pug",
            "./src/views/**/*.pug",
            "./src/blocks/**/*.js",
        ]
    },
    templates: {
        src: "./src/views/templates/*.pug",
        dist: "./dist/templates/",
        watch: "./src/views/templates/*.pug",
    },
    styles: {
        src: [
            "./src/styles/*.scss",

        ],
        dist: "./dist/styles/",
        watch: [
            "./src/blocks/**/*.{scss,sass}",
            "./src/styles/**/*.{scss,sass}"
        ]
    },
    scripts: {
        src: "./src/js/index.js",
        dist: "./dist/js/",
        watch: [
            "./src/blocks/**/*.js",
            "./src/js/**/*.js"
        ]
    },
    json: {
        src: "./src/json/",
        dist: "./dist/json/",
        watch: [
            "./src/blocks/**/*.js",
            "./src/js/**/*.js",
            "./src/js/**/*.php"
        ]
    },

    vendor: {
        watch: [
            "./src/blocks/**/*.js",
            "./src/js/**/*.js"
        ]
    },
    common: {
        watch: [
            "./src/js/**/*.js",
            "./src/blocks/**/*.js"
        ]
    },
    images: {
        src: [
            "./src/img/**/*.{jpg,jpeg,png,gif,tiff,svg}",
            "!./src/img/favicon/*.{jpg,jpeg,png,gif,tiff}"
        ],
        dist: "./dist/img/",
        watch: "./src/img/**/*.{jpg,jpeg,png,gif,svg}"
    },
    webp: {
        src: [
            "./src/img/**/*.{jpg,jpeg,png,tiff}",
            "!./src/img/favicon/*.{jpg,jpeg,png,gif}"
        ],
        dist: "./dist/img/",
        watch: [
            "./src/img/**/*.{jpg,jpeg,png,tiff}",
            "!./src/img/favicon.{jpg,jpeg,png,gif}"
        ]
    },
    sprites: {
        src: "./src/img/svg/*.svg",
        dist: "./dist/img/sprites/",
        watch: "./src/img/svg/*.svg"
    },
    fonts: {
        src: "./src/fonts/**/*.{woff,woff2}",
        dist: "./dist/fonts/",
        watch: "./src/fonts/**/*.{woff,woff2}"
    },
    favicons: {
        src: "./src/img/favicon/*.{jpg,jpeg,png,gif,tiff}",
        dist: "./dist/img/favicons/",
    },
    libs: {
        src: "./src/js/lib/*.{js,json}",
        dist: "./dist/js/lib/",
        watch: [
            "./src/blocks/**/*.{js,json}",
            "./src/js/**/*.js"
        ]
    },
    gzip: {
        src: "./src/.htaccess",
        dist: "./dist/"
    },
    data: {
        src: "./src/data/data.json",
    }
};
