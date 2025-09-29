import Cookies from "js-cookie";

const setAcceptCookie = () => {
    Cookies.set('cookies_accept', true, {expires: 365});
};

export const CheckCookies = async () => {
    if (Cookies.get('cookies_accept')) return;

    const template = await fetch(`/templates/cookies.html`).then(resp => resp.text());

    const wrp = document.createElement('div');
    wrp.classList.add('cookies-wrp');
    wrp.innerHTML = template;

    wrp.querySelector('button').addEventListener('click', () => {
        wrp.classList.add('hide');
        setAcceptCookie();
    });

    document.body.appendChild(wrp);



}
