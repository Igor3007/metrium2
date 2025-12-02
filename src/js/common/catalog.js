import { initSliderMinicard, initMinicardEvents } from "./minicard.js"

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

export const initFormChangeCurrency = (form) => {
    let checkedCurrency = form.querySelector('input[name="currency"]:checked')?.value;

    let minPriceInput = form.querySelector('[name="price_from"]');
    let maxPriceInput = form.querySelector('[name="price_to"]');

    let minPrice = minPriceInput.getAttribute('data-placeholder-'+checkedCurrency);
    minPriceInput.setAttribute('placeholder', minPrice);
    let maxPrice = maxPriceInput.getAttribute('data-placeholder-'+checkedCurrency);
    maxPriceInput.setAttribute('placeholder', maxPrice);
}


export const initFormOnSubmit = () => {
    document
        .querySelectorAll('form[data-form="filter"]').forEach(form => {

            initFormChangeCurrency(form);

            form.addEventListener('submit', function (e) {
                e.preventDefault();

                const button = e.submitter;


                if(!button.dataset.quiz) {
                    submitForm(form, button ? button.value : 'page');
                }

                return false;
            })

            form.querySelectorAll('input[name="currency"]').forEach(input => {
                input.addEventListener('change', function(){
                    initFormChangeCurrency(form);
                })
            });

        });
}

export function generateFormUrl(form, btn) {
    const formData = new FormData(form);
    let url = form.getAttribute("action");

    if(btn == 'map') {
        url += '/map';
    }

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
        }
    });

    formData.forEach((val, name) => {
        if (name === '_token') return;
        if (name === 'sort') return;
        //if (name === 'currency' && !priceValue) return;

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

    return url;
}

function submitForm(form, btn) {

    let redirect = form.dataset.redirect;

    let url = generateFormUrl(form, btn);

    if (redirect) {
        window.location.href = url;
    }
    else {
        updateCatalogFromUrl(url, ({ data }) => {
            if (data.catalogHtml !== undefined) {
                document.querySelector('[data-catalog="catalog"]').innerHTML = data.catalogHtml;
            }

            /*let pagination = document.querySelector('[data-catalog="pagination"]');
            if(pagination) {
                document.querySelector('[data-catalog="pagination"]').innerHTML = data.paginationHtml;
            }*/
            if (data.countText !== undefined) {
                document.querySelector('[data-catalog="count"]').innerHTML = data.countText;
            }

            initSliderMinicard(document.querySelector('[data-catalog="objects"]'))
            initMinicardEvents(document.querySelector('[data-catalog="objects"]'))
        }, true, 'filter');
    }
}



function updateCatalogFromUrl(url, callback, addToHistory = true,custom = '') {
    fetch(url, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Custom': custom
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

            if(addToHistory) {
                history.pushState({ some: 'state' }, '', url);
            }

            showMore();
            ajaxPagination();
        })
        .catch(err => {

            console.log(err);

            window.STATUS.err('Извините, что-то пошло не так…');
        });
}

document.addEventListener('DOMContentLoaded', function () {
    showMore();
    ajaxPagination();
});
export const ajaxPagination = () => {
    let ajaxPaginate = document.querySelector('[data-catalog="catalog"]')?.dataset.ajaxPagination;
    if(ajaxPaginate) {
        document.querySelectorAll('.pagination__page li').forEach(btn => {
            if(!btn.classList.contains('disabled') && !btn.classList.contains('disabled')) {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();

                    let page = btn.querySelector('a').href;
                    let wrapper = btn.closest('[data-catalog="inner"]');

                    updateCatalogFromUrl(page, ({ data }) => {
                        let objectsBlock = wrapper.querySelector('[data-catalog="objects"]');
                        let paginationBlock = wrapper.querySelector('[data-catalog="pagination"]');

                        objectsBlock.innerHTML = data.objectsHtml;
                        paginationBlock.innerHTML = data.paginationHtml;
                    }, false, wrapper.dataset.id);

                    return false;
                });
            }
        });
    }
};
export const showMore = () => {
    let showMoreBtn = document.querySelector('.btn-show-more');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const nextPage = showMoreBtn.dataset.nextPage;
            /*const currentUrl = new URL(window.location.href);

            currentUrl.searchParams.set('page', nextPage);
            const newUrl = currentUrl.toString();*/

            let wrapper = showMoreBtn.closest('[data-catalog="inner"]');


            updateCatalogFromUrl(nextPage, ({ data }) => {


                let objectsBlock = wrapper.querySelector('[data-catalog="objects"]');
                let paginationBlock = wrapper.querySelector('[data-catalog="pagination"]');


                objectsBlock.innerHTML += data.objectsHtml;
                paginationBlock.innerHTML = data.paginationHtml;
            }, false, wrapper.dataset.id);

            return false;
        });
    }

}
