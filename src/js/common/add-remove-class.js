export const initAddRemoveClassButtons = () => {
    document
        .querySelectorAll('[data-add]')
        .forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const {target, add, parent, prevent} = el.dataset;
                if (!prevent || prevent !== "none") {
                    e.preventDefault();
                }

                if (target) {
                    document
                        .querySelectorAll(target)
                        .forEach(
                            el => {
                                el.classList.add(add)
                            });
                }

                if (parent) {
                    el.closest(parent).classList.add(add)
                }
            })
        });

    document
        .querySelectorAll('[data-remove]')
        .forEach(el => {
            el.addEventListener('click', (e) => {
                const {target, remove, parent, prevent} = el.dataset;
                if (!prevent || prevent !== "none") {
                    e.preventDefault();
                }
                if (target) {
                    document
                        .querySelectorAll(target)
                        .forEach(
                            el => {
                                el.classList.remove(remove)
                            });
                }

                if (parent) {
                    el.closest(parent).classList.remove(remove)
                }
            })
        });
}
