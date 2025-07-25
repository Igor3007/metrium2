import {afLightbox} from "../vendor/af-lightbox.js";

export const initPopupSelect = () => {
    document
        .querySelectorAll('[data-selectpopup]')
        .forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectQuery = btn.dataset.selectpopup;
                const select = document.querySelector(selectQuery);

                const wrapper = document.createElement('div');
                wrapper.classList.add('popup-select');

                select
                    .querySelectorAll('option')
                    .forEach(opt => {
                        const selected = opt.getAttribute('selected');
                        const item = document.createElement('button');
                        if (selected) {
                            item.classList.add('selected');
                        }
                        item.innerHTML = opt.innerHTML;
                        item.addEventListener('click', (e) => {
                            // remove `selected` attribute from all options
                            opt.parentElement
                                .querySelectorAll('option')
                                .forEach(optx => {
                                    optx.removeAttribute('selected');
                                })
                            // and set to chosen one
                            opt.setAttribute('selected', 'selected');
                            popup.close();
                            select.dispatchEvent(new Event('change'));
                        })
                        wrapper.appendChild(item);
                    });

                const popup = new afLightbox({mobileInBottom: true});
                popup.open('<div></div>', () => {});
                popup.replaceContent(wrapper);
            })
        })
}

