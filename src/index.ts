import { DonutContainer } from "./DonutContainer";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    const donutContainer = new DonutContainer(canvas);
    document.body.appendChild(canvas);
    donutContainer.run();
});
