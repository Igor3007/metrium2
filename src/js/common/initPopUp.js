import {afLightbox} from "../vendor/af-lightbox.js";
import {MaskInput} from "maska";
import {callbackFormProcess} from "./callback-forms.js";
export const initPopUp = (container) => {
    if(container) {
        container
            .querySelectorAll("[data-tpl]")
            .forEach(el => {
                const marker = "popup-added";
                if (el.classList.contains(marker)) {
                    return;
                }
                el.classList.add(marker);
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

                    let template;
                    try {
                        template = await fetch(url).then(resp => resp.text());
                    } catch (e) {
                        template = "<div></div>";
                        console.error(e)
                    }

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
    }
}
