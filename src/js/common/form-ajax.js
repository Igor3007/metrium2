export const initFormAJAX = () => {
    document
        .querySelectorAll('form[data-send="ajax"]')
        .forEach((form) => {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
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

                    if(response.ok && result.success)
                    {
                        form.reset();
                        window.STATUS.msg('Форма успешно отправлена');
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
