import { DonutContainer2D } from "./DonutContainer2D";
import { DonutContainer3D } from "./DonutContainer3D";

enum Type {
    CONTEXT_2D = "Switch to WebGL",
    CONTEXT_WEBGL = "Switch to 2D",
}

let canvas: HTMLCanvasElement;
let donutContainer: DonutContainer2D | DonutContainer3D | null;
let canvasContainer: HTMLElement | null;
let animationFrameId: ReturnType<typeof requestAnimationFrame> = 0;

function prepareCanvas() {
    if (!canvasContainer) {
        throw new Error("Missing canvas parent containet!");
    }

    if (canvas && donutContainer) {
        donutContainer.destructor();
        canvasContainer.removeChild(canvas);
        donutContainer = null;
    }

    canvas = document.createElement("canvas");

    canvasContainer.appendChild(canvas);
}

function start2D () {
    if (!canvasContainer) {
        return;
    }

    prepareCanvas();
    donutContainer = new DonutContainer2D({ canvas });
    run(Math.PI);
}

function start3D() {
    if (!canvasContainer) {
        return;
    }

    prepareCanvas();
    donutContainer = new DonutContainer3D({ canvas });
    run(Math.PI);
}

function run(radiansPerSecond: number) {
    let lastRender = performance.now();

    const renderLoop = (time: number) => {
        if (!donutContainer) {
            throw new Error("Missing donut container!");
        }

        const delta = (time - lastRender) / 1000;
        const step = radiansPerSecond * delta;
        lastRender = time;

        donutContainer.draw(step);
        animationFrameId = window.requestAnimationFrame(renderLoop);
    };
    animationFrameId = window.requestAnimationFrame(renderLoop);
}

function toggleButtonClick(e: MouseEvent) {
    const toggleButton = document.getElementById("toggleButton");

    cancelAnimationFrame(animationFrameId);

    if (toggleButton!.innerText === Type.CONTEXT_2D) {
        toggleButton!.innerText = Type.CONTEXT_WEBGL;
        start3D();
    } else {
        toggleButton!.innerText = Type.CONTEXT_2D;
        start2D();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggleButton");
    toggleButton!.addEventListener("click", toggleButtonClick);
    canvasContainer = document.getElementById("canvasContainer");
    start2D();
});
