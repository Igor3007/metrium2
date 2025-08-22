
class MapStatic {
    constructor(options) {
        this.center = options.center;
        this.element = options.element;
    }

    async init() {
        await ymaps3.ready;

        ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', [
            '@yandex/ymaps3-default-ui-theme@0.0'
        ]);

        const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer,YMapControls, YMapMarker} = ymaps3;
        const {YMapZoomControl} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

        this.map = new YMap(
            this.element,
            {
                zoomRange: {
                    min: 5,
                    max: 20
                },
                location: {
                    center: this.center,
                    zoom: 10
                }
            }
        );

        const markerElement = document.createElement('div');
        markerElement.className = 'static-map-marker';

        const marker = new YMapMarker({
            coordinates: this.center,
        }, markerElement)

        this.map
            .addChild(new YMapDefaultSchemeLayer())
            .addChild(new YMapDefaultFeaturesLayer())
            .addChild(marker)
            .addChild(
                new YMapControls({position: 'right'})
                    .addChild(new YMapZoomControl({}))
            );

    }

}
export const initStaticMaps = () => {
    document
        .querySelectorAll('.map-static')
        .forEach(map => {
            const {center} = map.dataset;
            const mapStatic = new MapStatic({center: center.split(","), element: map});
            mapStatic.init().catch(err => {
                console.error(err);
            });
        });
}
