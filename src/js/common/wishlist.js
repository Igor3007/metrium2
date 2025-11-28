import Cookies from "js-cookie";

export class WishList {

    constructor(params) {
        this.elemCookie = params.elemCookie;
        this.elemTotal = document.querySelectorAll(params.elemTotal);

        this.init()
    }

    init() {
        this.getTotal()
    }

    getTotal() {
        this.elemTotal.forEach(t => {
            t.innerText = this.getArray().length || '0';
        });
    }

    getArray() {
        if (!Cookies.get(this.elemCookie)) return new Array()
        return String(Cookies.get(this.elemCookie)).split(',')
    }

    isset(id) {
        return this.getArray().includes(id)
    }

    add(id) {
        var array = this.getArray();
        array.push(id)
        array = Array.from(new Set(array))

        Cookies.set(this.elemCookie, array.join(','), {
            expires: 7
        })

        this.getTotal()
        return array;
    }

    remove(id) {

        var array = this.getArray();
        var result = array.filter(function (item) {
            return item != id
        })

        Cookies.set(this.elemCookie, result.join(','), {
            expires: 7
        })

        this.getTotal()
        return array;
    }

    toggle(id) {
        this.isset(id) ? this.remove(id) : this.add(id)
    }
}

export function initWishLists(container) {

    if (!window.wishlist) {
        window.wishlist = new WishList({
            elemCookie: 'wishlist',
            elemTotal: '[data-total="wishlist"]',
        });
    }


    if(container) {
        const items = container.querySelectorAll('[data-wishlist]');

        if (!items.length) return;
        const init = 'initialized';

        items.forEach(item => {
            if (item.classList.contains(init)) return;

            item.classList.add(init);
            if (window.wishlist.getArray().includes(item.dataset.wishlist)) {
                item.classList.add('is-active')
            }

            item.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();

                window.wishlist.toggle(item.dataset.wishlist)

                document.querySelectorAll('[data-wishlist]').forEach(el => {
                    if (item.dataset.wishlist == el.dataset.wishlist) {
                        el.classList.toggle('is-active', (window.wishlist.isset(item.dataset.wishlist)))
                    }
                })

                return false;
            })
        })
    }
}
