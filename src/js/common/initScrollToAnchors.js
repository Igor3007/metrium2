/**
 *  Smooth scroll with anchor links
 */
export const initScrollToAnchors = () => {
    document
        .querySelectorAll('a[href^="#"]:not([href="#"])') // all links starts with "#" but not single "#"
        .forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const href = a.getAttribute('href');
                const id = href.split('#')[1].split('?')[0];

                const target = document.getElementById(id);

                if (!target) return;

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                })
            });
        });
}
