import { EstateMap } from "./estate-map.js";
import { generateFormUrl } from "./catalog.js";

export const initMap = async () => {
    const mapContainer = document.getElementById('city-map');
    const resultContainer = document.getElementById('city-map-results');
    const resultWrapper = document.querySelector('.city-map__list');
    const loader = document.querySelector('#loader');
    if (!mapContainer) { return}
    let form = document.querySelector('.city-map .page-filter form');

    const map = new EstateMap({element: mapContainer, resultContainer, resultWrapper, loader, form});
    await map.init();


    form.addEventListener("submit", e => {
        e.preventDefault();

        let url = generateFormUrl(form);

        map.redraw(url);

        document.querySelector('.city-map__list')?.classList.remove('open');
        document.querySelector('.city-map__filters')?.classList.remove('sm-modal');
    })


    document.querySelector('.city-map__list .close')?.addEventListener('click', e => {
        e.preventDefault();
        document
            .querySelectorAll('.map-point')?.forEach((item) => {
            item.classList.remove('active');
        });
    });

    document.querySelector('.page-filter .close').addEventListener('click', e => {
        document.body.classList.remove('page-hidden');
    });

    document.querySelector('[data-target=".city-map__filters"]').addEventListener('click', e => {
        document.body.classList.add('page-hidden');
    });

    document.querySelector('.page-filter').addEventListener('click', e => {
        e.stopPropagation();
    });

    document.querySelector('.city-map__filters')?.addEventListener('click', e => {
        document.body.classList.remove('page-hidden');
        document.querySelector('.city-map__filters')?.classList.remove('sm-modal');
    })
}
