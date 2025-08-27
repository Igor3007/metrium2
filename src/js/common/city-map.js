import { EstateMap } from "./estate-map.js";

export const initMap = async () => {
    const mapContainer = document.getElementById('city-map');
    const resultContainer = document.getElementById('city-map-results');
    const resultWrapper = document.querySelector('.city-map__list');
    const loader = document.querySelector('#loader');
    if (!mapContainer) { return}

    let templateUrl;
    const {pathname} = window.location;

    switch (pathname) {
        case "/country-map.html":
            templateUrl = '/templates/country-card.html';
            break
        default:
            templateUrl = '/templates/estate-card.html';
            break;
    }

    const map = new EstateMap({element: mapContainer, resultContainer, resultWrapper, loader, templateUrl});
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
                document.querySelector('.city-map__list')?.classList.remove('open');
                document.querySelector('.city-map__filters')?.classList.remove('sm-modal');
            })
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
