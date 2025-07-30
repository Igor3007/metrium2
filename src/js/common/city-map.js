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
}
