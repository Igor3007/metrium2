import {Splide} from "@splidejs/splide";
import {SLIDER_ARROW_PATH} from "../../../js/common/consts.js";
import {SplideNavHelper} from "../../../js/common/splide-nav-helper.js";

export const initSliderViewed = () => {
    document
        .querySelectorAll('[data-slider="viewed"]')
        .forEach(slider => {
            slider['Splide'] = new Splide(slider, {

                arrows: false,
                arrowPath: SLIDER_ARROW_PATH,
                pagination: false,
                gap: 36,
                start: 0,
                fixedWidth: '510px',
                perMove: 1,
                flickMaxPages: 1,
                flickPower: 100,
                offsetPagination: 2,
                breakpoints: {
                    480: {
                        gap: 8,
                        fixedWidth: '87.9vw',
                        pagination: true,
                    },

                    640: {
                        gap: 8,
                        fixedWidth: '400px',
                        pagination: true,
                    },

                    767: {
                        gap: 8,
                        fixedWidth: '440px',
                        offsetPagination: false
                    },

                    992: {
                        gap: 12,
                        fixedWidth: '440px',
                        offsetPagination: false
                    },

                    1360: {
                        gap: 24,
                        fixedWidth: '410px',
                        offsetPagination: false
                    },


                }

            });

            // disable drag on hover
            slider.querySelectorAll('.minicard__slider').forEach(gallery => {
                gallery.addEventListener('mouseenter', () => {
                    slider['Splide'].options = {
                        drag: false,
                    };
                })
                gallery.addEventListener('mouseleave', () => {
                    slider['Splide'].options = {
                        drag: true,
                    };
                })
            })

            // init splide nav
            new SplideNavHelper({
                slider: slider['Splide'],
                btn: 'viewed',
                container: slider.closest('section')
            })

            //init filter

            slider['Splide'].mount();
        })
}

