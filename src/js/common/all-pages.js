document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('.scroll-top')?.addEventListener('click', (e) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    });

    window.addEventListener('scroll', () => {
        document.body.classList.toggle('scrolled', window.scrollY > 5)
    });

});



