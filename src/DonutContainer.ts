import { Donut } from "./Donut";
import { getRandomColor, atan2Arc, getAngle, getDistance } from "./utils";
import { Coords } from "./types";

type ShowFps = (fps: number) => void;

export class DonutContainer {
    private canvas: HTMLCanvasElement;
    private canvasRect: ClientRect;
    private ctx: CanvasRenderingContext2D | null;
    private donutCountX = 20;
    private donutCountY = 20;
    private donutOuterRadius = 25;
    private donutInnerRadius = 10;
    private donuts: Donut[][] = [];

    public constructor (canvas: HTMLCanvasElement) {
        const donutDiameter = 2 * this.donutOuterRadius;
        const canvasWidth = `${this.donutCountX * donutDiameter}`;
        const canvasHeight = `${this.donutCountY * donutDiameter}`;
        const startAngle = Math.PI * 0.5;
        const endAngle = Math.PI * 2;

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.canvas.setAttribute("width", canvasWidth);
        this.canvas.setAttribute("height", canvasHeight);
        this.canvas.addEventListener("click", this.onClick);

        for (let x = 0; x < this.donutCountX; x++) {
            this.donuts[x] = [];
            for (let y = 0; y < this.donutCountY; y++) {
                const center: Coords = {
                    x: (2 * x + 1) * this.donutOuterRadius,
                    y: (2 * y + 1) * this.donutOuterRadius
                };
                this.donuts[x][y] = new Donut({
                    center,
                    startAngle,
                    endAngle,
                    color: getRandomColor(),
                    ctx: this.ctx,
                    innerRadius: this.donutInnerRadius,
                    outerRadius: this.donutOuterRadius,
                });
            }
        }
    }

    public run(radiansPerSecond: number, showFps?: ShowFps): void {
        const FPS = 30;
        const INTERVAL = 1000 / FPS;
        let performanceTime = performance.now();
        let performanceDelta = 0;
        const renderLoop = (time: number) => {
            performanceDelta = time - performanceTime;

            if (performanceDelta > INTERVAL) {
                const step = radiansPerSecond * performanceDelta / 1000;
                performanceTime = time - (performanceDelta % INTERVAL);

                if (showFps) {
                    showFps(Math.round(1000 / performanceDelta));
                }

                this.donuts.forEach((row: Donut[], x: number) => {
                    row.forEach((donut: Donut, y: number) => {
                        const { startAngle, endAngle } = donut.getProps();

                        donut.render({
                            startAngle: startAngle + step,
                            endAngle: endAngle + step,
                        });
                    });
                });
            }

            window.requestAnimationFrame(renderLoop);
        };

        window.requestAnimationFrame(renderLoop);
    }

    private onClick = (e: MouseEvent) => {
        if (!this.canvasRect) {
            this.canvasRect = this.canvas.getBoundingClientRect();
        }

        const clickCoords: Coords = {
            x: e.pageX - this.canvasRect.left,
            y: e.pageY - this.canvasRect.top,
        };
        const donutCoords = this.getDonutCoords(clickCoords);
        console.log(this.isDonutHit(this.donuts[donutCoords.x][donutCoords.y], clickCoords));
    }

    private getDonutCoords(coords: Coords): Coords {
        return {
            x: Math.floor(coords.x / 2 / this.donutOuterRadius),
            y: Math.floor(coords.y / 2 / this.donutOuterRadius),
        };
    }

    private isDonutHit(donut: Donut, clickCoords: Coords): boolean {
        const { center, startAngle, endAngle } = donut.getProps();
        const clickAngle = atan2Arc(getAngle(center, clickCoords));
        const clickDistance = getDistance(center, clickCoords);
        console.log({ startAngle, clickAngle, endAngle });
        console.log({ donutInnerRadius: this.donutInnerRadius, clickDistance, donutOuterRadius: this.donutOuterRadius });
        return clickAngle >= startAngle
            && clickAngle <= endAngle
            && this.donutInnerRadius <= clickDistance
            && this.donutOuterRadius >= clickDistance;
    }
}
