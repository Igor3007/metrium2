import { EstateMap } from "./estate-map.js";

export const initMap = async () => {
    const mapContainer = document.getElementById('city-map');
    const resultContainer = document.getElementById('city-map-results');
    const resultWrapper = document.querySelector('.city-map__list');
    if (!mapContainer) { return}

    const map = new EstateMap({element: mapContainer, resultContainer, resultWrapper});
    await map.init();

    document
        .querySelectorAll('.city-map .page-filter form')
        .forEach((form) => {
            form.addEventListener("submit", e => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                // todo form new url
                const filteredUrl = "/json/filtered-map.json";
                map.redraw(filteredUrl);
                document.querySelector('.city-map__filters')?.classList.remove('sm-modal');
            })
        })

    document.querySelector('.city-map__list .close')?.addEventListener('click', e => {
        e.preventDefault();
        document
            .querySelectorAll('.map-point')?.forEach((item) => {
            item.classList.remove('active');
        });
    })

    document.querySelector('.page-filter .close').addEventListener('click', e => {
        document.body.classList.remove('frozen');
    })

    document.querySelector('[data-target=".city-map__filters"]').addEventListener('click', e => {
        document.body.classList.add('frozen');
    })
}
