export const initTogglers = () => {
    document
        .querySelectorAll('[data-toggle]')
        .forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const {target, toggle} = el.dataset;
                document
                    .querySelectorAll(target)
                    .forEach(
                        el => {
                            el.classList.toggle(toggle)
                        });
            })
        });
}