export const initFormAJAX = () => {
    document
        .querySelectorAll('form[data-send="ajax"]')
        .forEach((form) => {
            form.addEventListener("submit", e => {
                e.preventDefault();
                const url = form.getAttribute("action");
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                fetch(url, {
                    method: "POST",
                    body: data
                })
                    .then(res => {
                        if (res.ok) {
                            window.STATUS.msg(successMsg)
                        } else {
                            window.STATUS.err(res.statusText);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        window.STATUS.err('Извините, что-то пошло не так…');
                    });
            })

        })
}
