export const initPrefixedInputs = () => {
    document
        .querySelectorAll(".prefixed-input")
        .forEach((el) => {
            const input = el.querySelector("input");
            el.addEventListener("click", (e) => {
                console.log(input);
                input.focus();
            })

        })
}
