document.addEventListener('DOMContentLoaded', function (event) {

    const API_YMAPS = 'https://api-maps.yandex.ru/2.1/?apikey=0e2d85e0-7f40-4425-aab6-ff6d922bb371&suggest_apikey=ad5015b5-5f39-4ba3-9731-a83afcecb740&lang=ru_RU&mode=debug';
    const SLIDER_ARROW_PATH = 'M16.2859 12.2421C16.6493 11.9029 17.2188 11.9225 17.558 12.2859L23.7802 18.9526C24.1029 19.2984 24.1029 19.835 23.7802 20.1808L17.558 26.8474C17.2188 27.2108 16.6493 27.2304 16.2859 26.8913C15.9225 26.5521 15.9029 25.9826 16.2421 25.6193L21.8911 19.5667L16.2421 13.5141C15.9029 13.1507 15.9225 12.5812 16.2859 12.2421Z'


    /* =================================================
    css variable
    =================================================*/

    function css_variable() {
        let vh = window.innerHeight * 0.01;
        let hgtheader = document.querySelector('.header') ? document.querySelector('.header').clientHeight : 64
        let hgtheadertop = document.querySelector('.header-top') ? document.querySelector('.header-top').clientHeight : 41
        let sphead = document.querySelector('.sp-head') ? document.querySelector('.sp-head').clientHeight : 41

        document.documentElement.style.setProperty('--vh', vh + 'px');
        document.documentElement.style.setProperty('--hgt-header', hgtheader + 'px');
        document.documentElement.style.setProperty('--hgt-header-top', hgtheadertop + 'px');
        document.documentElement.style.setProperty('--hgt-sp-head', sphead + 'px');

        return {
            vh,
            hgtheader,
            hgtheadertop,
            sphead
        }
    }

    window.addEventListener('load', css_variable)
    window.addEventListener('resize', css_variable)

    /* =================================================
    load ymaps api
    =================================================*/

    window.loadApiYmaps = function (callback) {

        if (window.ymaps == undefined && !window.stateLoadingApi) {
            window.stateLoadingApi = true
            const script = document.createElement('script')
            script.src = API_YMAPS
            script.onload = () => {
                callback(window.ymaps)
            }
            document.head.append(script)
        } else {
            callback(window.ymaps)
        }

    }

    /* =================================================
    smooth scroll
    ================================================= */

    window.scrollToTargetAdjusted = function (params) {

        let element = typeof params.elem == 'string' ? document.querySelector(params.elem) : params.elem
        let elementPosition = element.getBoundingClientRect().top + window.scrollY

        let offsetPosition = elementPosition
        offsetPosition -= (params.offset ? params.offset : 0)

        window.scrollTo({
            top: Number(offsetPosition),
            behavior: "smooth"
        });
    }

    /* =================================================
    preloader
    ================================================= */

    class Preloader {

        constructor() {
            this.$el = this.init()
            this.state = false
        }

        init() {
            const el = document.createElement('div')
            el.classList.add('loading')
            el.innerHTML = '<div class="indeterminate"></div>';
            document.body.append(el)
            return el;
        }

        load() {

            this.state = true;

            setTimeout(() => {
                if (this.state) this.$el.classList.add('load')
            }, 300)
        }

        stop() {

            this.state = false;

            setTimeout(() => {
                if (this.$el.classList.contains('load'))
                    this.$el.classList.remove('load')
            }, 200)
        }

    }

    window.preloader = new Preloader();


    /* ==============================================
    Status
    ============================================== */

    function Status() {

        this.containerElem = '#status'
        this.headerElem = '#status_header'
        this.msgElem = '#status_msg'
        this.btnElem = '#status_btn'
        this.timeOut = 10000,
            this.autoHide = true

        this.init = function () {
            let elem = document.createElement('div')
            elem.setAttribute('id', 'status')
            elem.innerHTML = '<div id="status_header"></div> <div id="status_msg"></div><div id="status_btn"></div>'
            document.body.append(elem)

            document.querySelector(this.btnElem).addEventListener('click', function () {
                this.parentNode.setAttribute('class', '')
            })
        }

        this.msg = function (_msg, _header) {
            _header = (_header ? _header : 'Отлично!')
            this.onShow('complete', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }
        this.err = function (_msg, _header) {
            _header = (_header ? _header : 'Ошибка')
            this.onShow('error', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }
        this.wrn = function (_msg, _header) {
            _header = (_header ? _header : 'Внимание')
            this.onShow('warning', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }

        this.onShow = function (_type, _header, _msg) {
            document.querySelector(this.headerElem).innerText = _header
            document.querySelector(this.msgElem).innerText = _msg
            document.querySelector(this.containerElem).classList.add(_type)
        }

        this.onHide = function () {
            setTimeout(() => {
                document.querySelector(this.containerElem).setAttribute('class', '')
            }, this.timeOut);
        }

    }

    window.STATUS = new Status();
    const STATUS = window.STATUS;
    STATUS.init();

    /* ==============================================
    ajax request
    ============================================== */

    window.ajax = function (params, response) {

        //params Object
        //dom element
        //collback function

        window.preloader.load()

        let xhr = new XMLHttpRequest();
        xhr.open((params.type ? params.type : 'POST'), params.url)

        if (params.headers) {
            for (let key in params.headers) {
                xhr.setRequestHeader(key, params.headers[key]);
            }
        }

        if (params.responseType == 'json') {
            xhr.responseType = 'json';
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(JSON.stringify(params.data))
        } else {
            let formData = new FormData()
            for (key in params.data) {
                formData.append(key, params.data[key])
            }
            xhr.send(formData)
        }

        xhr.onload = function () {

            response ? response(xhr.status, xhr.response) : ''
            window.preloader.stop()
            setTimeout(function () {
                if (params.btn) {
                    params.btn.classList.remove('btn-loading')
                }
            }, 300)
        };

        xhr.onerror = function () {
            window.STATUS.err('Error: ajax request failed')
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 3) {
                if (params.btn) {
                    params.btn.classList.add('btn-loading')
                }
            }
        };
    }

    /* ==================================================
    maska
    ==================================================*/

    const {
        MaskInput,
    } = Maska

    function initMaska() {
        new MaskInput("[data-maska]")

        new MaskInput("[data-input-mask='name']", {
            mask: 'A',
            tokens: {
                A: {
                    pattern: /[a-zA-ZА-Яа-я ]/,
                    repeated: true
                },
            }
        })

    }

    initMaska();


    /* ==================================================
    burgerMenu
    ==================================================*/

    class MainMenu {
        constructor(ctx) {
            this.$el = ctx
            this.btns = this.$el.querySelectorAll('[data-menu="open"]')
            this.container = this.$el.querySelector('[data-menu="container"]')

            this.addEvent()
            this.afterLoad()
        }

        toggleMenu(item) {
            item.classList.toggle('is-open')

            if (!item.classList.contains('is-open')) {
                this.closeMenu()
            } else {
                this.openMenu()
            }
        }

        openMenu() {
            this.container.classList.toggle('is-open')
            this.$el.body.classList.toggle('page-hidden')
            this.$el.body.classList.toggle('open-modile-menu')

        }

        closeMenu() {
            this.btns.forEach(item => {
                !item.classList.contains('is-open') || item.classList.remove('is-open')
            });

            !this.$el.body.classList.contains('open-modile-menu') || !this.$el.body.classList.remove('open-modile-menu');
            !this.container.classList.contains('is-open') || this.container.classList.remove('is-open');
            !this.$el.body.classList.contains('page-hidden') || this.$el.body.classList.remove('page-hidden');
        }



        afterLoad() {
            this.container.querySelectorAll('.isset-sub').forEach(item => {
                item.addEventListener('click', e => {
                    e.stopPropagation()


                    if (e.target.classList.contains('is-open')) {
                        e.target.classList.remove('is-open')
                        return false;
                    }

                    e.target.closest('ul').querySelectorAll('.is-open').forEach(li => {
                        li.classList.remove('is-open')
                    })

                    e.target.classList.toggle('is-open')
                })
            })
        }

        addEvent() {
            this.btns.forEach(item => {
                item.addEventListener('click', e => this.toggleMenu(item))
            })

            this.$el.querySelectorAll('[data-menu="close"]').forEach(item => {
                item.addEventListener('click', () => {
                    this.closeMenu()
                })
            })
        }
    }

    if (document.querySelector('[data-menu="open"]')) {
        window.MainMenu = new MainMenu(document)
    }

    /* ==============================================
     select
    ============================================== */

    // public methods
    // select.afSelect.open()
    // select.afSelect.close()
    // select.afSelect.update()

    const selectCustom = new afSelect({
        selector: 'select'
    })

    selectCustom.init()

    /* ===============================================
    splide nav
    ===============================================*/

    class SplideNavHelper {

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

                setTimeout(() => {
                    if (this.slider.length <= this.slider.options.perPage) {
                        this.nextButton.setAttribute('disabled', 'disabled')
                        this.prevButton.setAttribute('disabled', 'disabled')
                    }
                }, 100)
            })


            this.slider.on('move', (newIndex, prevIndex, destIndex) => {
                this.nextButton.removeAttribute('disabled')
                this.prevButton.removeAttribute('disabled')

                if (destIndex == 0) {
                    this.prevButton.setAttribute('disabled', 'disabled')
                }

                if (this.slider.length == (destIndex + this.slider.options.perPage)) {
                    this.nextButton.setAttribute('disabled', 'disabled')
                }

                if (typeof this.params.onChange != 'undefined') {
                    this.params.onChange(destIndex + 1, this.slider.length)
                }
            })
        }

    }

    /* ===============================================
    slider card - categories__slider
    ===============================================*/

    document.querySelectorAll('[data-slider="category"]').forEach(slider => {

        slider['Splide'] = new Splide(slider, {

            arrows: false,
            arrowPath: SLIDER_ARROW_PATH,
            pagination: false,
            gap: '20px',
            start: 0,
            perMove: 1,
            flickMaxPages: 1,
            flickPower: 100,
            fixedWidth: '95px'

        });

        // init splide nav
        new SplideNavHelper({
            slider: slider['Splide'],
            btn: 'category',
            container: slider.closest('.card-categories')
        })

        slider['Splide'].mount();

    })

    /* ===============================================
    filter offers
    ===============================================*/

    class FilterOffeers {
        constructor(params) {
            this.$el = document.querySelector(params.el) || document
            this.filterItems = this.$el.querySelectorAll('[data-filter]')
            this.currencyItems = this.$el.querySelectorAll('[data-currency]')
            this.filterSlides = this.$el.querySelectorAll('[data-filter-id]')
            this.slider = params.slider
            this.currentFilter = null
            this.currentCurrency = null

            this.init()
        }

        init() {
            this.addEvent()
        }

        changeFilter(el) {

            const splideList = this.$el.querySelector('.splide__list--offers')
            splideList.innerHTML = ''


            if (this.currentFilter == el.dataset.filter) {
                this.filterSlides.forEach(item => {
                    splideList.append(item.cloneNode(true))
                })
                this.currentFilter = null
            } else {
                this.currentFilter = el.dataset.filter
                this.filterSlides.forEach(item => {
                    if (item.dataset.filterId == el.dataset.filter) {
                        splideList.append(item.cloneNode(true))
                    }
                })
            }

            this.slider.refresh();

            initSliderMinicard(splideList)
            initMinicardEvents(splideList)

            this.changeActiveFilter()

        }

        changeActiveFilter() {
            this.filterItems.forEach(el => {
                el.classList.toggle('is-active', el.dataset.filter == this.currentFilter)
            })
        }

        changeCurrency(el) {

            this.currentCurrency = el.dataset.currency

            this.currencyItems.forEach(el => {
                el.classList.toggle('is-active', el.dataset.currency == this.currentCurrency)
            })

            this.$el.querySelectorAll('.minicard').forEach(minicard => {
                minicard.querySelectorAll('[data-currency-id]').forEach(curr => {

                    console.log(curr)

                    curr.classList.toggle('is-active', curr.dataset.currencyId == this.currentCurrency)
                })
            })
        }

        addEvent() {
            this.filterItems.forEach(el => {
                el.addEventListener('click', (e) => this.changeFilter(el))
            })
            this.currencyItems.forEach(el => {
                el.addEventListener('click', (e) => this.changeCurrency(el))
            })
        }
    }

    /* ===============================================
    slider offers
    ===============================================*/

    document.querySelectorAll('[data-slider="offers"]').forEach(slider => {

        slider['Splide'] = new Splide(slider, {

            arrows: false,
            arrowPath: SLIDER_ARROW_PATH,
            pagination: false,
            gap: 36,
            start: 0,
            fixedWidth: '510px',
            perMove: 1,
            flickMaxPages: 1,
            flickPower: 100,
            breakpoints: {
                480: {
                    gap: 8,
                    fixedWidth: '85vw'
                },

                640: {
                    gap: 8,
                    fixedWidth: '400px'
                },

                767: {
                    gap: 8,
                    fixedWidth: '440px'
                },

                992: {
                    gap: 12,
                    fixedWidth: '440px'
                },

                1360: {
                    gap: 24,
                    fixedWidth: '510px'
                },


            }

        });

        // disable drag on hover
        slider.querySelectorAll('.minicard__slider').forEach(gallery => {
            gallery.addEventListener('mouseenter', () => {
                slider['Splide'].options = {
                    drag: false,
                };
            })
            gallery.addEventListener('mouseleave', () => {
                slider['Splide'].options = {
                    drag: true,
                };
            })
        })

        // init splide nav
        new SplideNavHelper({
            slider: slider['Splide'],
            btn: 'offers',
            container: slider.closest('section')
        })

        //init filter

        new FilterOffeers({
            el: '.section-best-offers',
            slider: slider['Splide']
        })

        slider['Splide'].mount();
    })

    /* ===============================================
    slider minicard
    ===============================================*/

    const initSliderMinicard = (conainer) => {
        conainer.querySelectorAll('[data-slider="minicard"]').forEach(slider => {

            const container = slider.closest('.minicard')
            const slideCounterCurrent = container.querySelector('[data-slider-counter="current"]')
            const slideCounterTotal = container.querySelector('[data-slider-counter="total"]')

            slider['Splide'] = new Splide(slider, {

                arrows: false,
                arrowPath: SLIDER_ARROW_PATH,
                pagination: false,
                gap: 20,
                start: 0,
                perPage: 1,
                perMove: 1,
                flickMaxPages: 1,
                flickPower: 100,

            });

            slider['Splide'].mount();

            slideCounterCurrent.innerText = 1
            slideCounterTotal.innerText = slider['Splide'].length


            // init splide nav
            new SplideNavHelper({
                slider: slider['Splide'],
                btn: 'minicard',
                container,
                onChange: (current, total) => {
                    slideCounterCurrent.innerText = current
                    slideCounterTotal.innerText = total
                }
            })

        })
    }

    initSliderMinicard(document);


    /* ===============================================
    minicard hover
    ===============================================*/

    const initMinicardEvents = (container) => {
        container.querySelectorAll('.minicard').forEach(el => {

            const slider = el.querySelector('[data-slider]')

            el.addEventListener('mouseenter', () => {
                if (slider['Splide'].index <= 1) slider['Splide'].go('>')
            })

            el.addEventListener('mouseleave', () => {
                if (slider['Splide'].index <= 1) slider['Splide'].go('<')
            })

        })
    }

    initMinicardEvents(document)

    /* ===============================================
    slider special-offers
    ===============================================*/

    document.querySelectorAll('[data-slider="special-offers"]').forEach(slider => {

        slider['Splide'] = new Splide(slider, {

            arrows: false,
            arrowPath: SLIDER_ARROW_PATH,
            pagination: false,
            gap: 16,
            start: 0,
            perPage: 4,
            fixedWidth: '440px',
            perMove: 1,
            flickMaxPages: 1,
            flickPower: 100,

            breakpoints: {
                480: {
                    fixedWidth: '85vw',
                    gap: 8,
                },

                640: {
                    fixedWidth: '400px',
                    gap: 8,
                },

                767: {
                    fixedWidth: '440px',
                    gap: 8,
                },

                992: {
                    fixedWidth: '440px',
                    gap: 12,
                },

                1200: {
                    fixedWidth: '440px',
                    gap: 16,
                },


            }

        });

        const container = slider.closest('section')
        const slideCounterCurrent = container.querySelector('[data-slider-counter="current"]')
        const slideCounterTotal = container.querySelector('[data-slider-counter="total"]')




        // init splide nav
        new SplideNavHelper({
            slider: slider['Splide'],
            btn: 'special-offers',
            container: slider.closest('section'),
            onChange: (current, total) => {
                slideCounterCurrent.innerText = current
                slideCounterTotal.innerText = total
            }
        })

        slider['Splide'].mount();

        slideCounterCurrent.innerText = 1
        slideCounterTotal.innerText = slider['Splide'].length

    })

    /* ===============================================
    slider partners
    ===============================================*/

    document.querySelectorAll('[data-slider="partners"]').forEach(slider => {

        slider['Splide'] = new Splide(slider, {

            arrows: false,
            arrowPath: SLIDER_ARROW_PATH,
            pagination: false,
            gap: 16,
            start: 0,
            fixedWidth: '240px',
            perMove: 1,
            flickMaxPages: 1,
            flickPower: 100,
            type: 'loop',
            padding: '5rem',
            focus: 'center',

        });

        // init splide nav
        new SplideNavHelper({
            slider: slider['Splide'],
            btn: 'partners',
            container: slider.closest('section'),
        })

        slider['Splide'].mount();

    })

    /* ===============================================
    slider partners
    ===============================================*/

    document.querySelectorAll('[data-slider="awards"]').forEach(slider => {

        slider['Splide'] = new Splide(slider, {

            arrows: false,
            arrowPath: SLIDER_ARROW_PATH,
            pagination: false,
            gap: 32,
            start: 0,
            perPage: 3,
            perMove: 1,
            flickMaxPages: 1,
            flickPower: 100,
            type: 'loop',



        });

        // init splide nav
        new SplideNavHelper({
            slider: slider['Splide'],
            btn: 'awards',
            container: slider.closest('section'),
        })

        slider['Splide'].mount();

    })

    /* ====================================
    flex collections
    ====================================*/

    class FlexCollections {
        constructor(params) {
            this.params = params
            this.$el = document.querySelector(params.el) || document
            this.widthButtonShowMore = 50;
            this.container = document.querySelector(this.params.container) || document
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



            if (document.body.clientWidth > 760) {
                return heightItem
            } else {
                return heightItem * 3
            }

        }

        render() {

            if (this.$el.closest(this.params.container).classList.contains('is-open')) {
                return false;
            }

            this.$el.querySelectorAll('li.is-hide').forEach(li => li.classList.remove('is-hide'))

            this.showMoreBotton.style.display = (this.heightItems() > this.heightContainer() ? 'flex' : 'none')

            let i = 0;

            console.log(this.heightItems())
            console.log(this.heightContainer())

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

            observer.observe(document.querySelector(this.params.container));

            this.showMoreBotton.addEventListener('click', e => {
                this.container.classList.toggle('is-open');
                this.showMoreBotton.querySelector('span').innerText = this.container.classList.contains('is-open') ? 'Свернуть' : '+'

            })
        }

    }

    if (document.querySelector('.fb-filter__selections')) {
        let collections = new FlexCollections({
            el: '.fb-filter__selections ul',
            container: '.fb-filter__selections'
        })
    }

}); //dcl