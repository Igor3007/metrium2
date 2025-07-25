export const checkboxTpl = ({data = {}, name, title}) => (
`<label class="checkbox" title="${title}">`+
`<input type="checkbox" ${Object.keys(data).map(x => (`data-${x}="${data[x]}"`)).join(" ")}>`+
`<span class="checkbox__elem"></span><span class="checkbox__text">${name}</span></label>`);

