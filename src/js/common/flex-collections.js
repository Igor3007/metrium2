/* ====================================
    flex collections
    ====================================*/

export class FlexCollections {
    constructor(params) {
        this.params = params
        this.$el = params.el || document
        this.widthButtonShowMore = 50;
        this.container = this.params.container || document
        this.showMoreBotton = this.container.querySelector('.show-more-tag')
        this.init()
    }

    init() {
        this.addEvent()
        this.render()
    }

    heightItems() {



        return this.$el.clientHeight;
    }

    heightContainer() {

        let heightItem = this.$el.querySelector('li').offsetHeight

        if (document.body.clientWidth > 767) {
            return heightItem
        } else {
            return (heightItem * 2) + 10
        }

    }

    render() {

        if (this.params.container.classList.contains('is-open')) {
            return false;
        }

        this.$el.querySelectorAll('li.is-hide').forEach(li => li.classList.remove('is-hide'))
        this.showMoreBotton.style.display = (this.heightItems() > this.heightContainer() ? 'flex' : 'none')
        let i = 0;
        while (this.heightItems() > this.heightContainer()) {
            let visibleElements = this.$el.querySelectorAll('li:not(.is-hide)')
            if (visibleElements[(visibleElements.length - 1)]) {
                visibleElements[(visibleElements.length - 1)].classList.add('is-hide')
            }

            i++;
            if (i > 100) return false
        }

        this.container.classList.contains('is-init') || this.container.classList.add('is-init')
    }

    debounce(method, delay, e) {
        clearTimeout(method._tId);
        method._tId = setTimeout(function () {
            method(e);
        }, delay);
    }


    addEvent() {
        const resizeHahdler = (e) => {
            this.render()
        }

        const observer = new ResizeObserver((entries) => {
            this.debounce(resizeHahdler, 30, entries)
        });

        observer.observe(this.params.container);

        this.showMoreBotton.addEventListener('click', e => {
            this.container.classList.toggle('is-open');
        })
    }

}
