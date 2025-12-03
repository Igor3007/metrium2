import {afLightbox} from "../vendor/af-lightbox.js";
import {MaskInput} from "maska";

export const initQuizButtons = (container) => {
    document
        .querySelectorAll('[data-quiz]')
        .forEach(btn => {
            const {
                quiz, action
            } = btn.dataset;

            if (!quiz || !action) return;

            btn.addEventListener('click', () => {
                new Quiz(quiz, action, 5, 6);
            });
        });
}

export class Quiz {
    constructor(tplUrl, action, questions, steps) {
        this.tplUrl = tplUrl;
        this.tpl = null;
        this.action = action;
        this.popup = null;
        this.step = 1;
        this.steps = steps;
        this.questions = questions;
        this.elements = {};

        this.init()
            .then()
            .catch(e => {
                console.error(e)
            });
    }

    async init() {
        this.popup = new afLightbox({mobileInBottom: true});
        this.popup.open('<div class="loader-wrapper abs"><div class="loader"></div></div>', () => {
        });
        this.tpl = await this.loadTemplate(this.tplUrl);
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.tpl;
        wrapper.classList.add('quiz');


        this.popup.replaceContent(wrapper);
        this.elements.wrapper = wrapper;
        this.elements.popup = wrapper.querySelector('.popup');
        this.elements.counter = wrapper.querySelector('.quiz__footer-counter');
        this.elements.next = wrapper.querySelector('[data-action="next"]');
        this.elements.backs = wrapper.querySelectorAll('[data-action="back"]');
        this.elements.submit = wrapper.querySelector('[data-action="submit"]');
        this.elements.close = wrapper.querySelector('[data-action="close"]');
        this.elements.form = wrapper.querySelector('form');

        new MaskInput("[data-maska]");

        this.initStep(1);
        this.elements.next.addEventListener('click', () => {
            this.nextStep()
        });
        this.elements.backs.forEach(btn => {
            btn.addEventListener('click', () => {
                this.prevStep()
            });
        });
        this.elements.submit.addEventListener('click', () => {
            this.submitForm()
        });
        this.elements.close.addEventListener('click', () => {
            this.popup.close();
        });
    }

    async loadTemplate(tplUrl) {
        let template;
        try {
            template = await fetch(tplUrl).then(resp => resp.text());
        } catch (e) {
            template = "<div></div>";
            console.error(e)
        }
        return template;
    }

    initStep(step) {
        this.step = parseInt(step);
        const popup = this.elements.popup;
        popup.classList.toggle('first', this.step === 1);
        popup.classList.toggle('last', this.step === +this.steps);
        popup.classList.toggle('questions', +this.step <= +this.questions);

        let classes = popup.classList.value;
        classes = classes
            .split(" ")
            .filter(x => !x.match(/step-\d+/))
            .join(" ");
        popup.classList.value = classes;

        popup.classList.add(`step-${step}`);

        this.elements.counter.innerHTML = `${this.step} / ${this.questions}`;
    }

    nextStep() {
        this.initStep(+this.step + 1);
    }

    prevStep() {
        this.initStep(+this.step - 1);
    }

    async submitForm() {
        const url = this.action;
        const formData = new FormData(this.elements.form);
        const data = Object.fromEntries(formData);
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        try {

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.elements.form.remove();
                this.elements.wrapper.classList.add('finish');
            } else {
                switch (response.status) {
                    case 422:
                        window.STATUS.err(result.error);
                        break;
                    case 429:
                        window.STATUS.err('Слишком много запросов! Попробуйте позже');
                        break;
                    default:
                        window.STATUS.err('Извините, что-то пошло не так…');
                        break;
                }
            }

        } catch (err) {
            console.error(err);
            window.STATUS.err('Извините, что-то пошло не так…');
        }

    }
}
