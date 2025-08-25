import {Splide} from "@splidejs/splide";

export const initGallery = () => {
    document
        .querySelectorAll('.gallery-big')
        .forEach(el => {

            const gallery = el.querySelector('.main');
            const thumbs = el.querySelector('.thumbs');

            const prevBtn = gallery.querySelector('.arrow[data-dir="prev"]');
            const nextBtn = gallery.querySelector('.arrow[data-dir="next"]');
            const counter = gallery.querySelector('.gallery-big__counter span');

            const mainSlider = new Splide(gallery,{});
            const thumbSlider  = new Splide(thumbs, {
                fixedWidth: 102,
                isNavigation: true,
                gap: 12
            });

            prevBtn.addEventListener('click', () => { mainSlider.go('-1') });
            nextBtn.addEventListener('click', () => { mainSlider.go('+1') });

            mainSlider.on('moved', () => {
                const { index, length } = mainSlider;
                const _index = index + 1;
                counter.innerHTML = `${_index} / ${length}`;
                prevBtn.classList.toggle('disabled', _index === 1);
                nextBtn.classList.toggle('disabled', _index === length);
            });

            mainSlider.sync( thumbSlider );
            mainSlider.mount();
            thumbSlider.mount();

            counter.innerHTML = `${mainSlider.index + 1} / ${mainSlider.length}`;

            // create a fsLightbox popup gallery
            const imgArray = Array.from(
                gallery.querySelectorAll('img')
            );
            const srcArray = imgArray.map(x => x.getAttribute('src'));

            const fsLightbox = new FsLightbox();
            fsLightbox.props.sources = srcArray;

            gallery.querySelector('.gallery-big__all').addEventListener('click', () => {
                fsLightbox.open(mainSlider.index);
            });

        });
}
