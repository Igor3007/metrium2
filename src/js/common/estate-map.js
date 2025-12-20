import {initMinicardEvents, initSliderMinicard} from "./minicard.js";
import {initWishLists} from "./wishlist.js";
import { generateFormUrl } from "./catalog.js";
import { initPopUp } from "./initPopUp.js";

export class EstateMap {

    constructor(options) {
        this.clusterer = null;
        this.element = options.element;
        this.resultContainer = options.resultContainer;
        this.resultWrapper = options.resultWrapper;
        this.loader = options.loader;
        this.form = options.form;
    }

    async init() {
        await ymaps3.ready;

        ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', [
            '@yandex/ymaps3-default-ui-theme@0.0',
            '@yandex/ymaps3-clusterer@0.0'
        ]);

        const {YMap, YMapDefaultSchemeLayer, YMapFeatureDataSource, YMapLayer, YMapControls} = ymaps3;
        const {YMapClusterer, clusterByGrid} = await ymaps3.import('@yandex/ymaps3-clusterer');
        const {YMapZoomControl} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');
        this.YMapClusterer = YMapClusterer;
        this.clusterByGrid = clusterByGrid;

        this.contentPin = document.createElement('div');
        this.contentPin.className = 'map-point single';
        this.contentPin.innerHTML = '<svg class="icon" width="24" height="24"><use href="/img/sprites/sprite.svg#logo-element"></use></svg>'

        this.map = new YMap(
            this.element,
            {
                zoomRange: {
                    min: 5,
                    max: 20
                },
                location: {
                    center: [37.588144, 55.733842],
                    zoom: 10
                }
            }
        );

        // Добавляем слои
        this.map
            .addChild(new YMapDefaultSchemeLayer())
            .addChild(new YMapFeatureDataSource({id: 'my-source'}))
            .addChild(new YMapLayer({source: 'my-source', type: 'markers', zIndex: 1800}))
            .addChild(
                new YMapControls({position: 'right'})
                    .addChild(new YMapZoomControl({}))
            );


        let url = generateFormUrl(this.form);

        await this.redraw(url);
        //await this.redraw('/json/map.json');


        this.form.querySelectorAll('select, input, textarea')
            .forEach(el => {
                el.addEventListener('change', (e) => {
                    this.submitForm(this.form);
                })
            });

        this.form.addEventListener('reset', (e) => {
            e.preventDefault();

            let url = this.form.getAttribute("action");
            window.location.href = url;

            return false;
        });

    }

    async submitForm(form) {
        let url = generateFormUrl(form);
        history.pushState({ some: 'state' }, '', url);
        document.querySelector('.city-map__list')?.classList.remove('open');
        await this.redraw(url);
    }

    removeClusters = () => {
        if (this.clusterer) {
            this.map.removeChild(this.clusterer);
        }
    }

    redraw = async (url) => {
        this.loader?.classList.remove('hidden');
        this.removeClusters();
        const mapData = await fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(res => res.json());

        const points = mapData.map((item, i) => ({
            id: i,
            geometry: {coordinates: item.coords},
            properties: {...item}
        }));

        this.clusterer = new this.YMapClusterer({
            method: this.clusterByGrid({gridSize: 64}),
            features: points,
            marker: this.marker,
            cluster: this.cluster
        });

        this.map.addChild(this.clusterer);
        setTimeout(() => {
            this.loader?.classList.add('hidden');
        }, 500);
    }

    drawCard = (el) => {
        const template = document.createElement('template');
        let content = this.cardTpl;
        content = content.replaceAll('{{id}}', el.id);
        content = content.replaceAll('{{image}}', "/img/objects/img-block-1");
        content = content.replaceAll('{{price}}', el.properties.price);

        template.innerHTML = content;

        const card = template.content.childNodes[0];

        initSliderMinicard(card);
        initMinicardEvents(card);
        initWishLists(card);
        initPopUp(card);


        return card;
    }

    drawLoader = () => {
        const loader = document.createElement('div');
        loader.className = 'loader-wrapper abs';
        loader.innerHTML = '<div class="loader"></div>';
        this.resultContainer.replaceChildren(loader);
    }

    drawResult = async (elements) => {
        this.drawLoader();
        const result = document.createDocumentFragment();

        let ids = elements.map(el => el.properties.id);

        const url = this.form.dataset.content;

        let currency = this.form.querySelector('input[name="currency"]:checked')?.value;

        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


        let html = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                ids: ids,
                currency: currency
            })
        }).then(res => res.text());

        const temp = document.createElement('div');
        temp.innerHTML = html;
        while (temp.firstChild) {
            result.appendChild(temp.firstChild);
        }

        initSliderMinicard(result);
        initMinicardEvents(result);
        initWishLists(result);

        /*elements.forEach((element) => {
            result.appendChild(this.drawCard(element));
        });*/

        setTimeout(() => {
            this.resultContainer.replaceChildren(result);
        }, 500);
    }

    setActivePoint = (_this) => {
        document
            .querySelectorAll('.map-point')?.forEach((item) => {
            item.classList.remove('active');
        });
        _this.style.element.classList.add('active');
    }

    marker = (feature) => {
        const _this = this;
        return new ymaps3.YMapMarker(
            {
                coordinates: feature.geometry.coordinates,
                source: 'my-source',
                onClick() {
                    _this.resultWrapper.classList.add('open');
                    _this.drawResult([feature]);
                    _this.setActivePoint(this);
                }
            },
            this.contentPin.cloneNode(true)
        );
    }

    cluster = (coordinates, features) => {
        const _this = this;
        return new ymaps3.YMapMarker(
            {
                coordinates,
                source: 'my-source',
                onClick() {
                    _this.resultWrapper.classList.add('open');
                    _this.drawResult(features);
                    _this.setActivePoint(this);
                }
            },
            this.circle(features.length).cloneNode(true)
        );
    }

    circle(count) {
        const circle = document.createElement('div');
        const _class = (count < 10) ? "small" : "large";
        circle.className = `map-point cluster ${_class}`;
        circle.innerHTML = `<span>${count}</span>`;
        return circle;
    }
}
