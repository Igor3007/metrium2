import { initSliderMinicard, initMinicardEvents } from "./minicard.js"

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

                    if (response.ok && result.success) {
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
            form
                .querySelectorAll('select, input, textarea')
                .forEach(el => {
                    el.addEventListener('change', (e) => {
                        form = el.closest('form');
                        submitForm(form);
                    })
                });

            form.addEventListener('reset', (e) => {
                e.preventDefault();

                let url = form.getAttribute("action");
                window.location.href = url;

                return false;
            });
        });
}

document.addEventListener('DOMContentLoaded', function () {
    initFormOnSubmit();
});

export const initFormOnSubmit = () => {
    document
        .querySelectorAll('form[data-form="filter"]').forEach(form => {
            console.log(form);
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                submitForm(form);
                return false;
            })
        });
}

function submitForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    let url = form.getAttribute("action");
    let redirect = form.dataset.redirect;

    const buckets = new Map(); // column => { operator, values: [] }
    // находим элемент формы, чтобы взять data-operator
    const getOperator = (name, value) => {
        // если это радиогруппа — ищем именно checked
        const checked = form.querySelector(`[name="${name}"]:checked`);
        if (checked) {
            return checked.dataset.operator || 'eq';
        }

        // если обычное поле (select/input)
        const el = form.querySelector(`[name="${name}"][value="${value}"]`)
            || form.querySelector(`[name="${name}"]`);
        return (el && el.dataset && el.dataset.operator) ? el.dataset.operator : 'eq';
    };



    let priceValue = false;
    formData.forEach((val, name) => {
        if ((name === 'price_from' || name === 'price_to') && val) {
            priceValue = true;
            return;
        }
    });
    formData.forEach((val, name) => {
        if (name === '_token') return;
        if (name === 'sort') return;
        if (name === 'currency' && !priceValue) return;

        const strVal = String(val).trim();
        if (strVal === '') return; // пустые значения пропускаем

        const column = name.replace(/\[\]$/, ''); // убираем [] у множественных
        const operator = getOperator(name, strVal);
        if (!operator) return; // radio/checkbox не выбран → пропускаем

        if (!buckets.has(column)) {
            buckets.set(column, { operator, values: [] });
        }

        buckets.get(column).values.push(strVal);
    });

    const parts = [];
    buckets.forEach(({ operator, values }, column) => {
        parts.push(`${column}-${operator}-${values.join(',')}`);
    });

    let filterUrl = parts.join('/');
    if (filterUrl) {
        filterUrl = '/filter/' + filterUrl;
    }

    const sort = formData.get('sort');
    if (sort) {
        filterUrl += '?sort=' + sort;
    }

    url += filterUrl;

    if (redirect) {
        window.location.href = url;
    }

    else {
        updateCatalogFromUrl(url, ({ data }) => {
            document.querySelector('[data-catalog="objects"]').innerHTML = data.objectsHtml;
            document.querySelector('[data-catalog="pagination"]').innerHTML = data.paginationHtml;
            document.querySelector('[data-catalog="count"]').innerHTML = data.countText;

            initSliderMinicard(document.querySelector('[data-catalog="objects"]'))
            initMinicardEvents(document.querySelector('[data-catalog="objects"]'))
        });
    }


}

function updateCatalogFromUrl(url, callback) {
    fetch(url, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'

        },
    })
        .then(res => {
            if (!res.ok) throw new Error('Извините, что-то пошло не так…');
            return res.json();
        })
        .then(data => {

            if (typeof callback === 'function') {
                callback({ data });
            }

            history.pushState({ some: 'state' }, '', url);

            showMore();
        })
        .catch(err => {
            window.STATUS.err('Извините, что-то пошло не так…');
        });
}

document.addEventListener('DOMContentLoaded', function () {
    showMore();
});

export const showMore = () => {
    let showMore = document.querySelector('.btn-show-more');
    if (showMore) {
        showMore.addEventListener('click', function (e) {
            e.preventDefault();

            const nextPage = showMore.dataset.nextPage;
            const currentUrl = new URL(window.location.href);

            currentUrl.searchParams.set('page', nextPage);
            const newUrl = currentUrl.toString();

            updateCatalogFromUrl(newUrl, ({ data }) => {
                document.querySelector('[data-catalog="objects"]').innerHTML += data.objectsHtml;
                document.querySelector('[data-catalog="pagination"]').innerHTML = data.paginationHtml;
            });

            return false;
        });
    }

}
