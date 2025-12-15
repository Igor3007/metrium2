import {
    Splide
} from "@splidejs/splide";

export const initOwnersSlider = () => {
    document
        .querySelectorAll('[data-slider="owners-case"]')
        .forEach(slider => {
            const caseSlider = new Splide(slider, {
                type: "loop",
                perPage: 3,
                perMove: 1,
                focus: "center",
                updateOnMove: true,
                breakpoints: {
                    1100: {
                        arrows: false,
                        perPage: 1,
                        pagination: false
                    }
                }
            });
            caseSlider.mount();
        });
}
