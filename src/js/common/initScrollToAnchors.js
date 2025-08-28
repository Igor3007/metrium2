/**
 *  Smooth scroll with anchor links
 */
export const initScrollToAnchors = () => {
    let options = {
        root: null,
        rootMargin: "-200px 0px 0px 0px", // average header + anchor block
        threshold: 0,
    };

    let callback = (entries, observer) => {
        entries.forEach(entry => {
                const {target} = entry;
                const id = target.getAttribute('id');
                document.querySelectorAll(`a[href="#${id}"]`).forEach(a => {
                    a.classList.toggle('active', entry.isIntersecting)
                })
        })
    };

    let observer = new IntersectionObserver(callback, options);

    document
        .querySelectorAll('.observed')
        .forEach(a => {
            const href = a.getAttribute('href');
            const id = href.split('#')[1].split('?')[0];
            const target = document.getElementById(id);
            if (!target) return;

            a.addEventListener('click', (e) => {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                })
            });

            observer.observe(target);
        });
}
