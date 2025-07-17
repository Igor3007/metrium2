export const initToggleTicks = () => {
    document
        .querySelectorAll('[data-ticktoggle]')
        .forEach((el) => {
            el.addEventListener('click', (e) => {
               e.preventDefault();
               const {ticktarget, ticktoggle, tickparent} = el.dataset;
               if (ticktarget) {
                   document
                       .querySelectorAll(ticktarget)
                       .forEach((target) => {
                           target.classList.toggle(ticktoggle);
                       })
               }
               if (tickparent) {
                   el.closest(ticktarget).classList.toggle(ticktoggle);
               }
               el.classList.toggle('on');
            });
        })
}
