import {Splide} from "@splidejs/splide";

export const initGallery = () => {
    document
        .querySelectorAll('.gallery-big')
        .forEach(el => {

            const gallery = el.querySelector('.main');
            const thumbs = el.querySelector('.thumbs');

            const mainSlider = new Splide(gallery,{});

            const thumbSlider  = new Splide(thumbs, {
                fixedWidth: 102,
                gap: 12
            });

            mainSlider.mount();
            thumbSlider.mount();
        });
}
