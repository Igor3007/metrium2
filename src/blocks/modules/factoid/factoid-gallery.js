import {Splide} from "@splidejs/splide";

export const initFactoidGallery = () => {
    document
        .querySelectorAll('.gallery-facts')
        .forEach(el => {

            const gallery = el.querySelector('.main');
            const prevBtn = gallery.querySelector('.arrow[data-dir="prev"]');
            const nextBtn = gallery.querySelector('.arrow[data-dir="next"]');
            const counter = gallery.querySelector('.gallery-facts__counter span');

            const mainSlider = new Splide(gallery,{
                pagination: false,
                arrows: false
            });

            mainSlider.on('moved', () => {
                const { index, length } = mainSlider;
                const _index = index + 1;
                counter.innerHTML = `${_index} / ${length}`;
                prevBtn.classList.toggle('disabled', _index === 1);
                nextBtn.classList.toggle('disabled', _index === length);
            });

            prevBtn.addEventListener('click', () => { mainSlider.go('-1') });
            nextBtn.addEventListener('click', () => { mainSlider.go('+1') });

            mainSlider.mount();

            counter.innerHTML = `${mainSlider.index + 1} / ${mainSlider.length}`;
        });
}
