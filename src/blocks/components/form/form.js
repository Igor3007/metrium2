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
                        to_custom.querySelector('.select-styled span').innerText = value;
                    }
                });

                to_el.addEventListener('change', (e) => {
                    const {value} = to_el;
                    const from_custom = from_el.closest('.af-select');
                    from_custom.querySelectorAll('.select-options li').forEach(option => {
                        const _value = option.getAttribute('rel');
                        option.classList.toggle('disabled', parseInt(value) < parseInt(_value));
                    });
                    const from_value = from_custom.querySelector('.select-styled span').innerText;
                    if (parseInt(value) < parseInt(from_value)) {
                        from_custom.querySelector('.select-styled span').innerText = value;
                    }
                })
            });

    }, 300);

});
