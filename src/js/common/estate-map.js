import {initMinicardEvents, initSliderMinicard} from "./minicard.js";
import {initWishLists} from "./wishlist.js";

export class EstateMap {

    constructor(options) {
        this.clusterer = null;
        this.element = options.element;
        this.resultContainer = options.resultContainer;
        this.resultWrapper = options.resultWrapper;
        this.loader = options.loader;
        this.cardTpl = null;
    }

    async init() {
        await ymaps3.ready;
        this.cardTpl = await fetch('/templates/estate-card.html').then(res => res.text());

        ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', [
            '@yandex/ymaps3-default-ui-theme@0.0',
            '@yandex/ymaps3-clusterer@0.0'
        ]);

        const {YMap, YMapDefaultSchemeLayer,YMapFeatureDataSource,YMapLayer} = ymaps3;
        const {YMapClusterer, clusterByGrid} = await ymaps3.import('@yandex/ymaps3-clusterer');
        // this.YMap = YMap;
        // this.YMapDefaultSchemeLayer = YMapDefaultSchemeLayer;
        // this.YMapFeatureDataSource = YMapFeatureDataSource;
        // this.YMapLayer = YMapLayer;
        this.YMapClusterer = YMapClusterer;
        this.clusterByGrid = clusterByGrid;

        this.contentPin = document.createElement('div');
        this.contentPin.className = 'map-point single';

        this.map = new YMap(
            this.element,
            {
                location: {center: [37.588144, 55.733842],zoom: 10}
            }
        );

        // Добавляем слои
        this.map
            .addChild(new YMapDefaultSchemeLayer())
            .addChild(new YMapFeatureDataSource({id: 'my-source'}))
            .addChild(new YMapLayer({source: 'my-source', type: 'markers', zIndex: 1800}));

        await this.redraw('/json/map.json');
    }

    removeClusters = () => {
        if (this.clusterer) {
            this.map.removeChild(this.clusterer);
        }
    }

    redraw = async (url) => {
        this.loader?.classList.remove('hidden');
        this.removeClusters();
        const mapData = await fetch(url)
            .then(res => res.json());

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

        return card;
    }

    drawLoader = () => {
        const loader = document.createElement('div');
        loader.className = 'loader-wrapper abs';
        loader.innerHTML = '<div class="loader"></div>';
        this.resultContainer.replaceChildren(loader);
    }

    drawResult = (elements) => {
        this.drawLoader();
        const result = document.createDocumentFragment();
        elements.forEach((element) => {result.appendChild(this.drawCard(element));});

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
