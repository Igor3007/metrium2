import {
    Splide
} from "@splidejs/splide";

export const initOwnersSlider = () => {
    document
        .querySelectorAll('[slider="owners-case"]')
        .forEach(slider => {
            const caseSlider = new Splide(slider, {
                type: "loop",
                perPage: 3,
                perMove: 1
            });
            caseSlider.mount();
        });
}
