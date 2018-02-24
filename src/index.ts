import { DonutContainer } from "./DonutContainer";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    const fpsContainer = document.querySelector(".fps");
    const donutContainer = new DonutContainer(canvas);

    document.body.appendChild(canvas);
    donutContainer.run(Math.PI, (fps: number) => {
        if (fpsContainer) {
            fpsContainer.innerHTML = `FPS: ${fps}`;
        }
    });
});
