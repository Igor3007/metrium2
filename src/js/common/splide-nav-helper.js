export class SplideNavHelper {

    constructor(params) {

        this.params = params
        this.slider = params.slider
        this.btn = params.btn
        this.container = params.container

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

                if (!is_overflow) {
                    this.nextButton.setAttribute('disabled', 'disabled')
                    this.prevButton.setAttribute('disabled', 'disabled')
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

            if (this.slider.length == slideTotal) {
                this.nextButton.setAttribute('disabled', 'disabled')
            }

            if (typeof this.params.onChange != 'undefined') {
                this.params.onChange(destIndex + 1, this.slider.length)
            }
        })
    }

}
