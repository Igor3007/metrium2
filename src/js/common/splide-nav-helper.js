export class SplideNavHelper {

    constructor(params) {

        this.params = params
        this.slider = params.slider
        this.btn = params.btn
        this.container = params.container
        this.dynamicMode = false
        this.prevButton = null
        this.nextButton = null

        this.init()
    }

    init() {
        this.prevButton = this.container.querySelector('[data-slider-prev="' + this.btn + '"]')
        this.nextButton = this.container.querySelector('[data-slider-next="' + this.btn + '"]')
        this.prevButton.setAttribute('disabled', 'disabled')

        this.addEvent()
    }

    scrollToElem(elem, container) {
        var rect = elem.getBoundingClientRect();
        var rectContainer = container.getBoundingClientRect();

        let elemOffset = {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        }

        let containerOffset = {
            top: rectContainer.top + document.body.scrollTop,
            left: rectContainer.left + document.body.scrollLeft
        }

        let leftPX = elemOffset.left - containerOffset.left + container.scrollLeft - (container.offsetWidth / 2) + ((elem.offsetWidth + 0) / 2)

        container.scrollTo({
            left: leftPX,
            behavior: 'smooth'
        });
    }

    addEvent() {
        this.prevButton.addEventListener('click', e => {
            this.slider.go('<')
        })

        this.nextButton.addEventListener('click', e => {
            this.slider.go('>')
        })



        this.slider.on('mounted refresh', () => {

            this.nextButton.removeAttribute('disabled')
            let is_overflow = !this.slider.root.classList.contains('is-overflow')
            this.nextButton.classList.toggle('is-hide', is_overflow)
            this.prevButton.classList.toggle('is-hide', is_overflow)

            setTimeout(() => {

                if (this.container.querySelector('.splide-counter')) {
                    //скрыть счетчик если нету стрелок
                    this.container.querySelector('.splide-counter').classList.toggle('is-hide', is_overflow)
                }

                if(this.slider.Components.Pagination.items.length > 10) {
                    this.slider.root.classList.add('is-dynamic-pagination')
                    this.dynamicMode = true
                }

            }, 100)


        })


        this.slider.on('move', (newIndex, prevIndex, destIndex) => {

            this.nextButton.removeAttribute('disabled')
            this.prevButton.removeAttribute('disabled')

            if (this.slider.options.type == 'loop') {
                return false
            }

            if (destIndex == 0) {
                this.prevButton.setAttribute('disabled', 'disabled')
            }

            let slideTotal = (destIndex + this.slider.options.perPage)

            if (this.slider.options.offsetPagination) {
                slideTotal = slideTotal + this.slider.options.offsetPagination
            }

            if (this.slider.length == slideTotal && newIndex != 0) {
                this.nextButton.setAttribute('disabled', 'disabled')
            }

            if (typeof this.params.onChange != 'undefined') {
                this.params.onChange(destIndex + 1, this.slider.length)
            }

            if(this.dynamicMode) {
                const elem = this.slider.Components.Pagination.items[newIndex].li;
                this.scrollToElem(elem, this.slider.root.querySelector('.splide__pagination'))
            }
        })
    }

}
