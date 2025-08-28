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

export const initFormOnChangeSubmit = () => {
    document
        .querySelectorAll('form[data-send="ajax-on-change"]')
        .forEach(form => {
            const url = form.getAttribute("action");
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            form
                .querySelectorAll('select, input, textarea')
                .forEach(el => {
                    el.addEventListener('change', (e) => {
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
                });
        });
}
