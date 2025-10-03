import {afLightbox} from "../vendor/af-lightbox.js";

const showPopup = async (popupUrl) => {
    const template = await fetch(popupUrl).then(resp => resp.text());
    const popup = new afLightbox({mobileInBottom: true});
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;
    wrapper.querySelector('button').addEventListener('click', () => {
        popup.close()
    })
    popup.open('<div></div>', () => {
    });
    popup.replaceContent(wrapper);
};
export const callbackFormProcess = () => {
    document
        .querySelectorAll('form[data-send="ajax"]')
        .forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const {type} = e.submitter?.dataset;
                const url = form.getAttribute("action");
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                try {

                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': data._token // берем токен из формы
                        },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        form.reset();

                        if(form.dataset.popup) {
                            showPopup(form.dataset.popup);
                        }
                        else {
                            window.STATUS.msg('Форма успешно отправлена');

                        }
                        return;
                    }

                    //Ошибка валидации (422)
                    if (response.status === 422) {
                        window.STATUS.err(result.error);
                        return;
                    }

                    //Ограничение частоты запросов (429)
                    if (response.status === 429) {
                        window.STATUS.err('Слишком много запросов! Попробуйте позже');
                        return;
                    }

                    //Любая другая ошибка (500 и т.п.)
                    console.error(err);
                    window.STATUS.err('Извините, что-то пошло не так…');
                }
                catch (err) {
                    console.error(err);
                    window.STATUS.err('Извините, что-то пошло не так…');
                }
            });


        })
}
