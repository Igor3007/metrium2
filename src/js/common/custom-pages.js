import {afLightbox} from "../vendor/af-lightbox.js";
import {MaskInput} from "maska";
import {callbackFormProcess} from "./callback-forms.js";

document.addEventListener('DOMContentLoaded', async function (event) {

    const {location} = window;
    const params = new URLSearchParams(location.search);

    const estateListView = () => {
        if (params.get('view') === 'list') {
            document.querySelector('.estate-list')?.classList.add('list');
        }
    };


    switch(location.pathname) {
        case '/city.html':
            estateListView();
            break;
        case '/country.html':
            estateListView();
            break;
    }


    document
        .querySelectorAll("[data-tpl]")
        .forEach(el => {
            el.addEventListener('click', async () => {

                document
                    .querySelectorAll("[popover]")
                    .forEach(popover => {popover.hidePopover()});

                const {tpl,objectType,objectId} = el.dataset;

                const params = new URLSearchParams();

                if (objectType) params.append('objectType', objectType);
                if (objectId)   params.append('objectId', objectId);

                const url = params.toString()
                    ? `/form/${tpl}?${params.toString()}`
                    : `/form/${tpl}`;

                const template = await fetch(url).then(resp => resp.text());
                const popup = new afLightbox({mobileInBottom: true});
                const wrapper = document.createElement('div');
                wrapper.innerHTML = template;

                /*wrapper.querySelector('button').addEventListener('click', () => {
                    popup.close();
                });*/

                wrapper
                    .querySelectorAll("[data-maska]")
                    .forEach(input => {
                        new MaskInput(input);
                    });

                popup.open('<div></div>', () => {
                });

                popup.replaceContent(wrapper);

                callbackFormProcess(wrapper, popup);


            });
        });

});
