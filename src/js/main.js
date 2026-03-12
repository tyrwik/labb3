import '../css/styles.scss'

const button = document.querySelector("#button");

button.addEventListener("click", () => {
    document.body.classList.toggle("alt-background");
});