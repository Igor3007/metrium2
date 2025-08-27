document.addEventListener('DOMContentLoaded', () => {

// Clear `prefixed-input` with clear icon
    document
        .querySelectorAll('.prefixed-input')
        .forEach(el => {
            const input = el.querySelector('input');
            el.querySelector('.clear')?.addEventListener('click', () => {
                input.value = '';
                input.dispatchEvent(new Event('change'));
            });
        });

    setTimeout(() => {

        document
            .querySelectorAll('.select-range')

            .forEach(el => {
                const from_el = el.querySelector('[data-range="from"]');
                const to_el = el.querySelector('[data-range="to"]');

                from_el.addEventListener('change', (e) => {
                    const {value} = from_el;
                    const to_custom = to_el.closest('.af-select');
                    to_custom.querySelectorAll('.select-options li').forEach(option => {
                        const _value = option.getAttribute('rel');
                        option.classList.toggle('disabled', parseInt(value) > parseInt(_value));
                    });
                    const to_value = to_custom.querySelector('.select-styled span').innerText;
                    if (parseInt(value) > parseInt(to_value)) {
                        to_custom.querySelector('.select-styled span').innerText = " ";
                    }
                });

                to_el.addEventListener('change', (e) => {
                    const {value} = to_el;
                    const from_custom = from_el.closest('.af-select');
                    const from_value = from_custom.querySelector('.select-styled span').innerText;
                    if (parseInt(value) < parseInt(from_value)) {
                        from_custom.querySelector('.select-styled span').innerText = value;
                    }
                })
            });

    }, 300);

    document
        .querySelectorAll('form')
        .forEach(form => {
            form.addEventListener('reset', (e) => {
                form.querySelectorAll('.district-selector').forEach(el => {
                    el.querySelector('input').value = "[]";
                    const container = el.querySelector("span");
                    const {placeholder} = el.dataset;
                    container.innerHTML = placeholder;
                });
            });
        });


    /* SELECT-RANGE-UNITS */

    document.querySelectorAll(".select-units").forEach(select => {
        const _head = select.querySelector('._head');
        const _body = select.querySelector('._body');
        const _from = select.querySelector('._from input');
        const _to = select.querySelector('._to input');

        const {placeholder, postfix} = select.dataset;

        let values = {
            from: undefined,
            to: undefined
        };

        const closeHandler = (e) => {
            if (_head.contains(e.target)) { return }
            if (!_body.contains(e.target)) {
                document.removeEventListener('click', closeHandler);
                select.classList.remove('active');
            }
        }

        const renderValues = () => {
            let unitEl = select.querySelector('._units input:checked');
            const unit = unitEl?.dataset.unit || postfix || "";
            let str = '';
            str += (values.from) ? `от ${values.from} ` : '';
            str += (values.to) ? `до ${values.to} ` : '';
            str = (str) ? `${placeholder}: ${str} ${unit}` : placeholder;
            _head.querySelector('span').innerHTML = str;
        }

        _head?.addEventListener('click', (e) => {
            select.classList.toggle('active');
            if (select.classList.contains('active')) {
                document.addEventListener('click', closeHandler);
            } else {
                document.removeEventListener('click', closeHandler);
            }
        });

        _from?.addEventListener('blur', (e) => {
            const {value} = e.target;
            values.from = parseInt(value.replace(/\D/g,'')) || '';
            e.target.value = values.from;
            e.target.dispatchEvent(new Event('change'));
        });

        _to?.addEventListener('blur', (e) => {
            const {value} = e.target;
            values.to = parseInt(value.replace(/\D/g,'')) || '';
            if (values.to < values.from) {
                values.to = '';
            }
            e.target.value = values.to;
            e.target.dispatchEvent(new Event('change'));
        });

        select.querySelectorAll('input').forEach(input => {
           input.addEventListener('change', renderValues);

           input.addEventListener('input', (e) => {
               let {value} = input;
               value = value.replace(/\D/g,'');
               input.value = value;
           });
        });



    });

    setTimeout(()=> {
        document
            .querySelectorAll('[data-redirect-input]')
            .forEach(el => {
                const id = el.dataset.redirectInput;
                const target = document.getElementById(id);
                if (!target) return;

                el.addEventListener('change', () => {
                    target.value = el.value;
                    target.dispatchEvent(new Event('change'));
                });
            });
    }, 1000); // timeout because afSelect clear eventListeners
});
