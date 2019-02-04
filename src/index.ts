import { DonutContainer2D } from "./canvas2d/DonutContainer2D";
import { DonutContainer3D } from "./canvasWebGL/DonutContainer3D";
import { Quad } from "./canvasWebGL/Quad";

enum Type {
    CONTEXT_2D = "Switch to WebGL",
    CONTEXT_WEBGL = "Switch to 2D",
}

let canvas: HTMLCanvasElement;
let donutContainer: DonutContainer2D | DonutContainer3D | null;
let canvasContainer: HTMLElement | null;

function prepareCanvas(width?: number, height?: number) {
    if (!canvasContainer) {
        throw new Error("Missing canvas parent containet!");
    }

    if (canvas && donutContainer) {
        // donutContainer.destructor();
        canvasContainer.removeChild(canvas);
        donutContainer = null;
    }

    canvas = document.createElement("canvas");

    if (width && height) {
        canvas.width = width;
        canvas.height = height;
    }

    canvasContainer.appendChild(canvas);
}

function start2D () {
    if (!canvasContainer) {
        return;
    }

    prepareCanvas();
    donutContainer = new DonutContainer2D(canvas, {});
    donutContainer.run(Math.PI);
}

function startWebGL() {
    if (!canvasContainer) {
        return;
    }

    prepareCanvas(768, 768);
    const quad = new Quad(canvas);
    quad.run();
    // donutContainer = new DonutContainer3D(canvas, {});
    // donutContainer.run(Math.PI);
}

function toggleButtonClick(e: MouseEvent) {
    if (e.toElement.innerHTML === Type.CONTEXT_2D) {
        e.toElement.innerHTML = Type.CONTEXT_WEBGL;
        startWebGL();
    } else {
        e.toElement.innerHTML = Type.CONTEXT_2D;
        start2D();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggleButton");
    toggleButton!.addEventListener("click", toggleButtonClick);
    canvasContainer = document.getElementById("canvasContainer");
    startWebGL();
});
