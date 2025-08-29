import {afLightbox} from "../../../js/vendor/af-lightbox.js";
import {checkboxTpl} from "../../../js/helpers/index.js";
import {pluralForm} from "../../../js/helpers/plural-form.js";

const initFilterSearch = (element, data) => {
    const input = element.querySelector(".input-filter input");
    const btn = element.querySelector(".input-filter button");
    if (!input) return;

    let bouncer = null;

    btn.addEventListener("click", () => {
        input.value = "";
        listUpdate("");
    });

    const listUpdate = (value) => {
        const VALUE = value?.trim().toUpperCase();
        const areasContainer = document.querySelector('.districts-popup__areas');
        const instantContainer = document.querySelector('.districts-popup__instant');

        if (!!VALUE) {
            areasContainer.classList.add('hidden');
            instantContainer.classList.add('hidden');
        } else {
            areasContainer.classList.remove('hidden');
            instantContainer.classList.remove('hidden');
        }

        data.districts.forEach(d => {
            const item = districts.querySelector(`[data-id="${d.id}"]`);
            const li = item.closest("li");
            if (!VALUE || d.name.toUpperCase().includes(VALUE)) {
                li.classList.remove("hidden");
            } else {
                li.classList.add("hidden");
            }
        });
    };

    input.addEventListener("input", (e) => {
        clearTimeout(bouncer);
        const {value} = e.target;
        bouncer = setTimeout(() => {listUpdate(value)}, 500);
    });
}

const initDistrictSelector = (element, template, data) => {
    const input = element.querySelector("input");
    const container = element.querySelector("span");
    const {placeholder, prefix, pluraltpl} = element.dataset;

    const plurals = pluraltpl?.split(",").map(item => item.trim());

    const resultString = (res) => {
        const n = res.length;
        switch (n) {
            case 0:
                return placeholder;
            case 1:
                return data.districts.find(x => (x.id === +res[0])).name;
            default:
                return pluralForm(n, plurals).replace('{{n}}', n);
        }
    };

    element.addEventListener("click", (e) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = template;

        const instants = wrapper.querySelector('#instants');
        const areas = wrapper.querySelector('#areas');
        const districts = wrapper.querySelector('#districts');
        const submit = wrapper.querySelector('[type="submit"]');
        const reset = wrapper.querySelector('[type="reset"]');
        const popup = new afLightbox({mobileInBottom: true, classes: "district-popup"});

        let initValue;
        try {
            initValue = JSON.parse(input.value);
        }
        catch (e) {
            initValue = [];
        }


        initFilterSearch(wrapper, data);

        data.instants.forEach(item => {
            const liNode = document.createElement("li");
            const name = data.districts.find(x => x.id === item).name;
            liNode.setAttribute("data-id", item);
            liNode.innerHTML = name;
            liNode.addEventListener("click", (e) => {
                input.value = `[${item}]`;
                container.innerHTML = `${prefix} ${name}`;
                popup.close();
            })
            instants.appendChild(liNode);
        });

        data.areas
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .forEach(x => {
                const node = document.createElement("li");
                node.innerHTML = checkboxTpl({data: {id: x.id}, name: x.name, title: x.fullName});
                areas.appendChild(node);

                node.querySelector("input").addEventListener("change", (e) => {
                    const {checked} = e.target;
                    districts.querySelectorAll(`[data-area="${x.id}"]`).forEach(z => {
                        z.checked = checked;
                    })
                })

            });

        let letter = '';
        let letterList = null; // промежуточный список районов на одну букву

        data.districts
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .forEach(x => {

                if (letter !== x.name[0]) {
                    if (letterList) {
                        districts.appendChild(letterList);
                    }
                    letter = x.name[0];
                    letterList = document.createElement("ul");
                    letterList.innerHTML = `<li class="letter">${letter}</li>`;
                }
                const node = document.createElement("li");
                node.classList.add("district");
                node.innerHTML = checkboxTpl({data: {id: x.id, area: x.area_id}, name: x.name, title: x.name});


                node.querySelector("input").addEventListener("change", (e) => {
                    areas.querySelector(`[data-id="${x.area_id}"]`).checked = false;
                })

                letterList.appendChild(node);
            });
        districts.appendChild(letterList);

        initValue.forEach((id) => {
            districts
                .querySelectorAll(`[data-id="${id}"]`)
                .forEach((elem) => {
                    elem.checked = true
                });
        });


        submit.addEventListener("click", (e) => {
            e.preventDefault();
            const result = [];
            districts.querySelectorAll(`input`).forEach(x => {
                if (x.checked) {
                    result.push(x.dataset.id);
                }
            });
            //input.value = JSON.stringify(result);
            input.value = result.join(',');

            input.dispatchEvent(new Event('change'));

            container.innerHTML = resultString(result);
            popup.close();
        })

        reset.addEventListener("click", (e) => {
            input.value = "[]";
            container.innerHTML = resultString([]);
            popup.close();
        })


        popup.open('', () => {
        });
        popup.replaceContent(wrapper);
    })
}

export const initDistrictSelectors = async () => {
    const data = await fetch('/api/districts').then(res => res.json());
    const template = await fetch('/districts/popup').then(res => res.text());

    document
        .querySelectorAll('.district-selector')
        .forEach((el) => {
            initDistrictSelector(el, template, data);
        });
}
