export const initFormattedInput = () => {
    document
        .querySelectorAll("input.formatted")
        .forEach(el => {
            el.addEventListener("keydown", (e) => {
                e.preventDefault();
                let val = e.target.value;
                val = val + e.key;
                val = val.replace(/\D+/g, "");
                val = parseInt(val).toLocaleString("ru");
                e.target.value = val;
            })
        });
}
