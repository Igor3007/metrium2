export const initTogglers = () => {
    document
        .querySelectorAll('[data-toggle]')
        .forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const {target, toggle, parent} = el.dataset;

                if (target) {
                    document
                        .querySelectorAll(target)
                        .forEach(
                            el => {
                                el.classList.toggle(toggle)
                            });
                }

                if (parent) {
                    el.closest(parent).classList.toggle(toggle)
                }
            })
        });
}
