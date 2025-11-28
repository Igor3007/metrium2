import {
    Splide
} from "@splidejs/splide";

import {
    scrollDynamicDots
} from "./splide-dynamic-dots";

export const initGallery = () => {



    document
        .querySelectorAll('.gallery-big')
        .forEach(el => {

            const gallery = el.querySelector('.main');
            const thumbs = el.querySelector('.thumbs');

            // setting
            const config = {
                dynamicMode: false,
                mobileBreakpoint: 768
            }

            if (gallery && thumbs) {
                const prevBtn = gallery.querySelector('.arrow[data-dir="prev"]');
                const nextBtn = gallery.querySelector('.arrow[data-dir="next"]');
                const counter = gallery.querySelector('.gallery-big__counter span');

                const mainSlider = new Splide(gallery, {});
                const thumbSlider = new Splide(thumbs, {
                    fixedWidth: 102,
                    snap: true,
                    gap: 12
                });

                prevBtn.addEventListener('click', () => {
                    mainSlider.go('-1')
                });
                nextBtn.addEventListener('click', () => {
                    mainSlider.go('+1')
                });

                mainSlider.on('mounted refresh', () => {
                    setTimeout(() => {
                        if (mainSlider.Components.Pagination.items.length > 10 && document.body.clientWidth <= config.mobileBreakpoint) {
                            mainSlider.root.classList.add('is-dynamic-pagination')
                            config.dynamicMode = true
                        }

                        mainSlider.root.classList.add('is-visible-pagination')
                    }, 100)
                })

                mainSlider.on('moved', () => {
                    const {
                        index,
                        length
                    } = mainSlider;
                    const _index = index + 1;
                    counter.innerHTML = `${_index} / ${length}`;
                    prevBtn.classList.toggle('disabled', _index === 1);
                    nextBtn.classList.toggle('disabled', _index === length);

                    thumbSlider.Components.Slides.get().forEach((s, i) => {
                        s.slide.classList.toggle('is-selected', i === index);
                    });
                });

                mainSlider.on('move', function (newIndex) {
                    thumbSlider.go(newIndex);

                    if (config.dynamicMode) {
                        const elem = mainSlider.Components.Pagination.items[newIndex].li;
                        scrollDynamicDots(elem, mainSlider.root.querySelector('.splide__pagination'), 300)
                    }
                });

                // При окончании драга
                thumbSlider.on('dragged', function (slide) {

                    console.log('ddd')

                    setTimeout(() => {
                        thumbSlider.root.querySelector('.splide__slide.is-active').classList.remove('is-active')
                    }, 430)
                });


                // При клике на миниатюру
                thumbSlider.on('click', function (slide) {
                    console.log(slide)
                    mainSlider.go(slide.index);
                });

                //mainSlider.sync( thumbSlider );
                mainSlider.mount();
                thumbSlider.mount();

                counter.innerHTML = `${mainSlider.index + 1} / ${mainSlider.length}`;
                thumbSlider.Components.Slides.getAt(0).slide.classList.add('is-selected');

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
            }
        });
}
