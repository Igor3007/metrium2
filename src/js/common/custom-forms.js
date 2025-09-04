import {afLightbox} from "../vendor/af-lightbox.js";

const showPopup = async () => {
    const template = await fetch("/templates/thanx.html").then(resp => resp.text());
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
export const callFormProcess = () => {
    document
        .querySelectorAll('.call-form')
        .forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const {type} = e.submitter?.dataset;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                const url = "#";

                fetch(url, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': data._token // берем токен из формы
                    },
                    body: JSON.stringify(data)
                })
                    .then(resp => {
                        showPopup(); // test purposes, remove
                        return resp.json()
                    })
                    .then(data => {
                        if (data && data.ok) {
                            // response process; get showPopup here
                        }
                    })
                    .catch(e => {
                        console.error(e);
                    });
            });


        })
}
