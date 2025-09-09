export const initSwitch = () => {
    document
        .querySelectorAll('[data-switch]')
        .forEach(switcher => {
            switcher.addEventListener('click', () => {
                switcher
                    .closest('.switch')
                    .querySelectorAll('[data-switch]')
                    .forEach(el => {
                        el.classList.remove('active');
                    });
                switcher.classList.add('active');

                const val = switcher.dataset.switch;

                const target = document.querySelector(`[data-case=${val}]`);
                if (!target) return;

                target
                    .closest('.switch')
                    .querySelectorAll('[data-case]')
                    .forEach(el => {
                        el.classList.remove('active');
                    });

                target.classList.add('active');
            });
        });
}
