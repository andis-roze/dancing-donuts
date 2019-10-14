import { DonutContainer2D } from "./DonutContainer2D";
import { DonutContainer3D } from "./DonutContainer3D";
import { roundToDecimals } from "./utils";

enum ContainerType {
    CONTEXT_2D = "2D",
    CONTEXT_3D = "3D",
}

const containerMap = {
    "2D": DonutContainer2D,
    "3D": DonutContainer3D,
};

document.addEventListener("DOMContentLoaded", () => {
    const fpsCanvas = document.getElementById("fpsCanvas") as HTMLCanvasElement;
    const fpsCtx = fpsCanvas.getContext("2d") as CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let donutContainer: DonutContainer2D | DonutContainer3D | null;
    const canvasContainer = document.getElementById("canvasContainer") as HTMLElement;
    let animationFrameId: ReturnType<typeof requestAnimationFrame> = 0;

    function getText(fun: ContainerType) {
        return `Switch to ${fun}`;
    }

    function updateFps(fps: string) {
        fpsCtx.font = "25px serif";
        fpsCtx.clearRect(0, 0, fpsCanvas.width, fpsCanvas.height);
        fpsCtx.fillText(fps, 0, 25);
    }

    function prepareCanvas() {
        if (!canvasContainer) {
            throw new Error("Missing canvas parent container!");
        }

        if (canvas && donutContainer) {
            donutContainer.destructor();
            canvasContainer.removeChild(canvas);
            donutContainer = null;
        }

        canvas = document.createElement("canvas");
        canvas.classList.add("donut-canvas");

        canvasContainer.appendChild(canvas);
    }

    function start (containerType: ContainerType, donutCount = 20) {
        const radiansPerSecond = Math.PI / 4;

        prepareCanvas();
        donutContainer = new containerMap[containerType]({
            canvas,
            donutCountX: donutCount,
            donutCountY: donutCount
        });
        run(radiansPerSecond);
    }

    function run(radiansPerSecond: number) {
        const fpsUpdateInterval = 1000;
        let lastRender = performance.now();
        let lastFpsUpdate = lastRender;

        const renderLoop = (time: number) => {
            if (!donutContainer) {
                throw new Error("Missing donut container!");
            }

            const delta = (time - lastRender) / 1000;
            const step = radiansPerSecond * delta;

            if (time - lastFpsUpdate >= fpsUpdateInterval) {
                const fps = 1 / delta;
                updateFps(`${roundToDecimals(fps, 3).toString()} FPS`);
                lastFpsUpdate = time;
            }

            lastRender = time;
            donutContainer.draw(step);
            animationFrameId = window.requestAnimationFrame(renderLoop);
        };
        animationFrameId = window.requestAnimationFrame(renderLoop);
    }

    const defaultContainer = ContainerType.CONTEXT_2D;

    const toggleButton = document.getElementById("toggleButton");
    const elDonutCount = document.getElementById("donutCount") as HTMLSelectElement;

    function toggleButtonClick(e: MouseEvent) {
        cancelAnimationFrame(animationFrameId);

        if (toggleButton!.innerText === getText(ContainerType.CONTEXT_2D)) {
            toggleButton!.innerText = getText(ContainerType.CONTEXT_3D);
            start(ContainerType.CONTEXT_2D, parseInt(elDonutCount!.value, 10));
        } else {
            toggleButton!.innerText = getText(ContainerType.CONTEXT_2D);
            start(ContainerType.CONTEXT_3D, parseInt(elDonutCount!.value, 10));
        }
    }

    toggleButton!.innerText = getText(
        defaultContainer === ContainerType.CONTEXT_2D
            ? ContainerType.CONTEXT_3D
            : ContainerType.CONTEXT_2D
    );
    toggleButton!.addEventListener("click", toggleButtonClick);
    elDonutCount!.addEventListener("change", (e: any) => {
        if (toggleButton!.innerText === getText(ContainerType.CONTEXT_2D)) {
            start(ContainerType.CONTEXT_3D, e.target.value);
        } else {
            start(ContainerType.CONTEXT_2D, e.target.value);
        }
    });
    start(defaultContainer);
});
