import { Splide } from "@splidejs/splide";
import { SLIDER_ARROW_PATH } from "./consts.js";
import { SplideNavHelper } from "./splide-nav-helper.js";
import { initPopUp } from "./initPopUp.js";
import { initWishLists } from "./wishlist.js";


/* ===============================================
slider minicard
===============================================*/

export const initSliderMinicard = (container) => {
    if(container) {
        container.querySelectorAll('[data-slider="minicard"]').forEach(slider => {

            const container = slider.closest('.minicard')
            const slideCounterCurrent = container.querySelector('[data-slider-counter="current"]')
            const slideCounterTotal = container.querySelector('[data-slider-counter="total"]')

            slider['Splide'] = new Splide(slider, {

                arrows: false,
                arrowPath: SLIDER_ARROW_PATH,
                pagination: false,
                gap: 20,
                lazyLoad: 'nearby',
                start: 0,
                perPage: 1,
                perMove: 1,
                flickMaxPages: 1,
                flickPower: 100,

            });

            slider['Splide'].mount();

            slideCounterCurrent.innerText = 1
            slideCounterTotal.innerText = slider['Splide'].length


            // init splide nav
            new SplideNavHelper({
                slider: slider['Splide'],
                btn: 'minicard',
                container,
                onChange: (current, total) => {
                    slideCounterCurrent.innerText = current
                    slideCounterTotal.innerText = total
                }
            });
            slider['Splide'].refresh();

        })
    }
}

/* ===============================================
minicard hover
===============================================*/

export const initMinicardEvents = (container) => {

    initPopUp(container);
    initWishLists(container);

    function openGalleryProduct(e, minicard) {
        const img = minicard.querySelectorAll('[data-slider="minicard"] img')
        const arrImage = [];

        img.forEach(image => {
            let src = image.getAttribute('src') || image.dataset.splideLazy;
            if (src) arrImage.push(src);
        })

        const instance = new FsLightbox();
        instance.props.dots = true;
        instance.props.type = "image";
        instance.props.sources = arrImage;
        instance.open(0)
    }

    if(container) {
        container.querySelectorAll('.minicard').forEach(el => {

            if (!el.querySelector('[data-slider]')) {
                return false
            }

            const slider = el.querySelector('[data-slider]')

            el.addEventListener('mouseenter', () => {
                if (slider['Splide'].index <= 1) slider['Splide'].go('>')
            })

            el.addEventListener('mouseleave', () => {
                if (slider['Splide'].index <= 1) slider['Splide'].go('<')
            })

            el.querySelector('.minicard__fullscreen')?.addEventListener('click', (e) => {
                openGalleryProduct(e, el)
            })

        })
    }
}
