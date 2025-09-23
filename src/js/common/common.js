import { MaskInput } from "maska";
import { afSelect } from "../vendor/af-select.js";
import { Splide } from "@splidejs/splide";
import { FlexCollections } from "./flex-collections.js";
import { SplideNavHelper } from "./splide-nav-helper.js";
import { initAddRemoveClassButtons } from "./add-remove-class.js";
import { initSliderViewed, initGallery, initFactoidGallery } from "../../blocks/modules/index.js";
import { initToggleTicks, initDistrictSelectors } from "../../blocks/components";
import { initTogglers } from "./toggler.js";
import { initFormAJAX, initFormOnChangeSubmit } from "./form-ajax.js";
import { initPrefixedInputs } from "./prefixed-inputs.js";
import { initPopupSelect } from "./popup-select.js";
import { initMap } from "./city-map.js";
import { initStaticMaps } from "./map-static.js";
import { initSliderMinicard, initMinicardEvents } from "./minicard.js";
import { initWishLists, WishList } from "./wishlist.js";
import { initScrollToAnchors } from "./initScrollToAnchors.js";
import { callFormProcess } from "./custom-forms.js";
import { initSwitch } from "./switcher.js";
import "fslightbox";
import "./all-pages.js";
import "./custom-pages.js";
import "../../blocks/components/form/form.js";

import {
    SLIDER_ARROW_PATH,
    API_YMAPS
} from "./consts.js";

document.addEventListener('DOMContentLoaded', function (event) {
    initTogglers();
    initToggleTicks();
    initAddRemoveClassButtons();
    initSliderViewed();
    initFormAJAX();
    initPrefixedInputs();
    initPopupSelect();
    initDistrictSelectors();
    initMap();
    initGallery();
    initScrollToAnchors();
    initStaticMaps();
    callFormProcess();
    initFactoidGallery();
    initSwitch();
    setTimeout(
        () => { initFormOnChangeSubmit() }
        , 500); // need to prevent clearing eventHandlers with afSelect

    /* =================================================
    css variable
    =================================================*/

    function css_variable() {
        let vh = window.innerHeight * 0.01;
        let hgtheader = document.querySelector('header') ? document.querySelector('header').clientHeight : 64
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

    window.addEventListener('load', css_variable);
    window.addEventListener('resize', css_variable);

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

    function initMaska() {
        new MaskInput("[data-maska]");

        new MaskInput("[data-input-mask='name']", {
            mask: 'A',
            tokens: {
                A: {
                    pattern: /[a-zA-ZА-Яа-я ]/,
                    repeated: true
                },
            }
        });

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

    /* ========================
        FORM data changes
    ========================= */

    document
        .querySelectorAll('form')
        .forEach(form => {
            form
                .querySelectorAll('input, select, textarea')
                .forEach(el => {
                    el.addEventListener('change', e => {
                        form.classList.add('touched');
                    })
                })
        })

    /* ==============================================
     select
    ============================================== */

    // public methods
    // select.afSelect.open()
    // select.afSelect.close()
    // select.afSelect.update()

    const selectCustom = new afSelect({
        selector: 'select:not(.native)'
    })

    selectCustom.init();

    document
        .querySelectorAll('form')
        .forEach(form => {
            form.addEventListener('reset', e => {
                form.classList.remove('touched');
                form.querySelectorAll('select:not(.native)').forEach(select => {
                    select.afSelect.reset();
                })
            })
        });


    /* ================================================
    scroll page
    ================================================*/

    if (document.querySelector('.section-first-block') && document.body.clientWidth >= 1200) {

        let scene = document.querySelector('.first-block-scroll-box')
        let stickyBlock = document.querySelector('.first-block')
        let header = document.querySelector('header')

        scene.style.setProperty('height', '1400px')
        stickyBlock.style.setProperty('position', 'sticky')
        stickyBlock.style.setProperty('top', '0')
        header.style.setProperty('position', 'fixed')

        window.addEventListener('scroll', () => {
            document.body.classList.toggle('is-scroll-page', window.scrollY > 5)
            document.body.classList.toggle('is-fixed-header', window.scrollY > scene.clientHeight)

            if ((scene.clientHeight - stickyBlock.clientHeight) < (window.scrollY - 30)) {
                header.style.removeProperty('position')
            } else {
                header.style.setProperty('position', 'fixed')
            }
        })

    }

    /* ===============================================
    slider card - categories__slider
    =============================================== */

    document.querySelectorAll('[data-slider="category"]').forEach(slider => {

        slider['Splide'] = new Splide(slider, {

            arrows: false,
            arrowPath: SLIDER_ARROW_PATH,
            pagination: false,
            gap: '20px',
            start: 0,
            perPage: 4,
            perMove: 1,
            flickMaxPages: 1,
            flickPower: 100,
            fixedWidth: '164px',

            breakpoints: {
                1440: {
                    fixedWidth: '120px',
                },
            }

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

            initSliderMinicard(splideList);
            initMinicardEvents(splideList);
            initWishLists(splideList);

            if (this.currentCurrency) {
                this.changeCurrency({
                    dataset: {
                        currency: this.currentCurrency
                    }
                })
            }


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

    document
        .querySelectorAll('[data-slider="offers"]')
        .forEach(slider => {
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
                offsetPagination: 2,
                breakpoints: {
                    480: {
                        gap: 8,
                        fixedWidth: '87.9vw',
                        pagination: true,
                    },

                    640: {
                        gap: 8,
                        fixedWidth: '400px',
                        pagination: true,
                    },

                    767: {
                        gap: 8,
                        fixedWidth: '440px',
                        offsetPagination: false
                    },

                    992: {
                        gap: 12,
                        fixedWidth: '440px',
                        offsetPagination: false
                    },

                    1360: {
                        gap: 24,
                        fixedWidth: '410px',
                        offsetPagination: false
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


    initSliderMinicard(document);
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
            fixedWidth: '440px',
            flickMaxPages: 1,
            flickPower: 100,
            offsetPagination: 2,

            breakpoints: {
                480: {
                    fixedWidth: '85vw',
                    gap: 8,
                    pagination: true,
                    offsetPagination: 0

                },

                576: {
                    fixedWidth: '400px',
                    gap: 8,
                    pagination: true,
                    offsetPagination: 0

                },

                767: {
                    fixedWidth: '360px',
                    gap: 8,
                    offsetPagination: 2

                },

                992: {
                    fixedWidth: '360px',
                    gap: 12,
                    offsetPagination: 2

                },

                1376: {
                    fixedWidth: '360px',
                    gap: 16,
                    offsetPagination: 2
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
                total = document.body.clientWidth > 576 ? total - 2 : total
                slideCounterCurrent.innerText = current
                slideCounterTotal.innerText = total;
            }
        })



        slider['Splide'].mount();

        let total = document.body.clientWidth > 576 ? slider['Splide'].length - 2 : slider['Splide'].length

        slideCounterCurrent.innerText = 1
        slideCounterTotal.innerText = total

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
            autoplay: true,
            interval: 2000,

            breakpoints: {
                1376: {
                    fixedWidth: '170px',
                },
            }

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
            pagination: true,
            gap: 32,
            start: 0,
            perPage: 3,
            perMove: 1,
            flickMaxPages: 1,
            flickPower: 100,
            fixedWidth: '512px',
            breakpoints: {
                480: {
                    fixedWidth: '85vw',
                    gap: 8,
                    pagination: true,
                    perPage: 1,
                },

                640: {
                    fixedWidth: '400px',
                    gap: 8,
                    pagination: true,
                    perPage: 1,
                },

                992: {
                    fixedWidth: '440px',
                    gap: 12,
                    perPage: 2,
                },

                1376: {
                    fixedWidth: '440px',
                    gap: 16,
                },


            }

        });

        // init splide nav
        new SplideNavHelper({
            slider: slider['Splide'],
            btn: 'awards',
            container: slider.closest('section'),
        })

        slider['Splide'].mount();

    })

    // apply `flex collections`
    document
        .querySelectorAll('[data-collection="flex"]')
        .forEach(item => {
            if (!item.classList.contains('.is-init')) {
                let collections = new FlexCollections({
                    el: item.querySelector('ul'),
                    container: item
                })
            }
        })

    /* ==============================================
    wishlist
    ==============================================*/
    window.wishlist = new WishList({
        elemCookie: 'wishlist',
        elemTotal: '[data-total="wishlist"]',
    });

    // init initWishLists
    initWishLists(document)

    /* ===============================================
    filter first block
    ===============================================*/


    class FBFilter {
        constructor() {

            this.$el = document.querySelector('.fb-filter') || document
            this.tabs = this.$el.querySelectorAll('[data-fb="tabs"] > li')
            this.tabsContent = this.$el.querySelectorAll('[data-fb="tabs-content"] > div')

            this.init()

        }

        init() {
            this.addEvents()
        }

        changeTab(i) {

            this.tabs.forEach((item, index) => item.classList.toggle('is-active', i == index))
            this.tabsContent.forEach((item, index) => item.classList.toggle('is-active', i == index))

        }

        addEvents() {
            this.tabs.forEach((item, i) => {
                item.addEventListener('click', e => this.changeTab(i))
            })
        }

    }

    if (document.querySelector('.fb-filter')) new FBFilter()


}); //dcl
