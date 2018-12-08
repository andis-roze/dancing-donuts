import { ClockWise, Coords } from "./types";
import {
    getRandomColor,
    getRandomDirection,
    reduceAngle,
    getDistance,
    atan2Arc,
    getAngle,
    getRandomArbitrary,
} from "./utils";
import { Donut } from "./Donut";

export interface DonutContainerProps {
    donutCountX: number;
    donutCountY: number;
    donutOuterRadius: number;
    donutInnerRadius: number;
}

export interface DonutState {
    donut: Donut;
    clockwise: ClockWise;
    rotationAngle: number;
    startAngle: number;
    endAngle: number;
    center: Coords;
}

export class DonutContainer {
    public donuts: DonutState[][] = [];
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private canvasRect: ClientRect;
    private donutCountX: number;
    private donutCountY: number;
    private donutOuterRadius: number;
    private donutInnerRadius: number;

    constructor(canvas: HTMLCanvasElement, props: Partial<DonutContainerProps>) {
        this.donutCountX = props.donutCountX || 20;
        this.donutCountY = props.donutCountY || 20;
        this.donutOuterRadius = props.donutOuterRadius || 25;
        this.donutInnerRadius = props.donutInnerRadius || 10;

        const donutDiameter = 2 * this.donutOuterRadius;
        const canvasWidth = `${this.donutCountX * donutDiameter}`;
        const canvasHeight = `${this.donutCountY * donutDiameter}`;
        const startAngle = Math.PI * getRandomArbitrary(0, 1.5);
        const endAngle = Math.PI * getRandomArbitrary(1.5, 2);

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.canvas.setAttribute("width", canvasWidth);
        this.canvas.setAttribute("height", canvasHeight);
        this.canvas.addEventListener("click", this.onClick);

        if (!this.ctx) {
            throw new Error("Canvas 2d rendering context failed to initialise!");
        }

        for (let x = 0; x < this.donutCountX; x++) {
            this.donuts[x] = [];
            for (let y = 0; y < this.donutCountY; y++) {
                this.donuts[x][y] = {
                    clockwise: getRandomDirection(),
                    rotationAngle: 0,
                    startAngle,
                    endAngle,
                    center: {
                        x: (2 * x + 1) * this.donutOuterRadius,
                        y: (2 * y + 1) * this.donutOuterRadius,
                    },
                    donut: new Donut({
                        startAngle,
                        endAngle,
                        color: getRandomColor(),
                        innerRadius: this.donutInnerRadius,
                        outerRadius: this.donutOuterRadius,
                    })
                };
                this.ctx.drawImage(
                    this.donuts[x][y].donut.getImage(),
                    2 * x * this.donutOuterRadius,
                    2 * y * this.donutOuterRadius
                );
            }
        }
    }

    public run(radiansPerSecond: number) {
        let lastRender = performance.now();
        const renderLoop = (time: number) => {
            if (!this.ctx) {
                throw new Error("Canvas 2d rendering context failed to initialise!");
            }

            const delta = (time - lastRender) / 1000;
            const step = radiansPerSecond * delta;
            lastRender = time;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.donuts.forEach((row: DonutState[], x: number) => {
                row.forEach((donutState: DonutState, y: number) => {
                    if (!this.ctx) {
                        throw new Error("Canvas 2d rendering context failed to initialise!");
                    }

                    donutState.rotationAngle = reduceAngle(donutState.rotationAngle + step * donutState.clockwise);
                    donutState.startAngle = reduceAngle(donutState.startAngle + step * donutState.clockwise);
                    donutState.endAngle = reduceAngle(donutState.endAngle + step * donutState.clockwise);
                    this.ctx.save();
                    this.ctx.translate(
                        (2 * x + 1) * this.donutOuterRadius,
                        (2 * y + 1) * this.donutOuterRadius
                        );
                    this.ctx.rotate(donutState.rotationAngle);
                    this.ctx.drawImage(
                        this.donuts[x][y].donut.getImage(),
                        -this.donutOuterRadius,
                        -this.donutOuterRadius
                    );
                    this.ctx.restore();
                });
            });

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
        const donutState = this.donuts[donutCoords.x][donutCoords.y];

        if (this.isDonutHit(donutState, clickCoords)) {
            donutState.clockwise = -1 * donutState.clockwise as ClockWise;
            donutState.donut.setColor(getRandomColor());
        }

    }

    private getDonutCoords(coords: Coords): Coords {
        return {
            x: Math.floor(coords.x / 2 / this.donutOuterRadius),
            y: Math.floor(coords.y / 2 / this.donutOuterRadius),
        };
    }

    private isDonutHit(donutState: DonutState, clickCoords: Coords): boolean {
        const clickDistance = getDistance(donutState.center, clickCoords);
        const startIsBigger = donutState.startAngle > donutState.endAngle;
        let clickAngle = atan2Arc(getAngle(donutState.center, clickCoords));

        clickAngle = startIsBigger && clickAngle < donutState.endAngle
            ? 2 * Math.PI + clickAngle
            : clickAngle;

        return this.donutInnerRadius <= clickDistance
            && this.donutOuterRadius >= clickDistance
            && clickAngle >= donutState.startAngle
            && clickAngle <= (startIsBigger ? 2 * Math.PI + donutState.endAngle : donutState.endAngle);
    }
}
