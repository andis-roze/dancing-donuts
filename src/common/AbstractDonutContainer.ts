import { Coords, ClockWise, DonutState } from "./types";
import {
    getRandomDirection,
    getRandomArbitrary,
    getRandomColor,
    getDistance,
    atan2Arc,
    getAngle,
    reduceAngle,
    drawDonut,
} from "../utils";

export interface DonutContainer {
    destructor(): void;
    draw(step: number): void;
}

export interface DonutContainerProps {
    canvas: HTMLCanvasElement;
    donutCountX?: number;
    donutCountY?: number;
    donutOuterRadius?: number;
    donutInnerRadius?: number;
}

export abstract class AbstractDonutContainer implements DonutContainer {
    protected abstract ctx: CanvasRenderingContext2D | WebGLRenderingContext;
    protected donuts: DonutState[][] = [];
    protected canvas: HTMLCanvasElement;
    protected canvasRect: ClientRect;
    protected donutCountX: number;
    protected donutCountY: number;
    protected donutOuterRadius: number;
    protected donutInnerRadius: number;
    protected sprites: HTMLCanvasElement;
    protected spritesCtx: CanvasRenderingContext2D;
    protected border = 1;
    protected donutWidth: number;
    protected margin = 1;

    public constructor(props: DonutContainerProps) {
        this.canvas = props.canvas;
        this.canvasRect = this.canvas.getBoundingClientRect();
        this.donutCountX = props.donutCountX || 20;
        this.donutCountY = props.donutCountY || 20;
        this.donutOuterRadius = props.donutOuterRadius || 25;
        this.donutInnerRadius = props.donutInnerRadius || 10;
        this.donutWidth = 2 * (this.donutOuterRadius + this.border);

        const canvasWidth = `${
            this.donutCountX * this.donutWidth
            + this.donutCountX * this.margin
        }`;
        const canvasHeight = `${
            this.donutCountY * this.donutWidth
            + this.donutCountY * this.margin
        }`;

        this.canvas.setAttribute("width", canvasWidth);
        this.canvas.setAttribute("height", canvasHeight);
        this.canvas.addEventListener("click", this.onClick);
        // this.canvas.addEventListener("touchend", this.onClick);

        this.sprites = document.createElement("canvas");
        this.sprites.setAttribute("width", canvasWidth);
        this.sprites.setAttribute("height", canvasHeight);
        const spritesCtx = this.sprites.getContext("2d");

        if (!spritesCtx) {
            throw Error("Sprite canvas 2d rendering context failed to initialise!");
        }

        this.spritesCtx = spritesCtx;
        this.initDonutState();
    }

    public destructor() {
        this.canvas.removeEventListener("click", this.onClick);
        // this.canvas.removeEventListener("touchend", this.onClick);
        delete this.canvasRect;
        delete this.ctx;
        delete this.canvas;
        delete this.donuts;
        delete this.sprites;
        delete this.spritesCtx;
        delete this.donutCountX;
        delete this.donutCountY;
        delete this.donutInnerRadius;
        delete this.donutOuterRadius;
        delete this.border;
        delete this.donutWidth;
    }

    public abstract draw(step: number): void;
    protected abstract onDonutHit(coords: Coords): void;

    private initDonutState() {
        for (let x = 0; x < this.donutCountX; x++) {
            this.donuts[x] = [];
            for (let y = 0; y < this.donutCountY; y++) {
                const color = getRandomColor();
                const rotationAngle = 0;
                const startAngle = getRandomArbitrary(0, 1.75 * Math.PI);
                const segmentAngle = getRandomArbitrary(Math.PI / 2, 1.75 * Math.PI);
                const endAngle = reduceAngle(startAngle + segmentAngle);
                this.donuts[x][y] = {
                    coords: {
                        x,
                        y,
                    },
                    border: this.border,
                    margin: this.margin,
                    outerRadius: this.donutOuterRadius,
                    innerRadius: this.donutInnerRadius,
                    color,
                    clockwise: getRandomDirection(),
                    rotationAngle,
                    startAngle,
                    endAngle,
                    segmentAngle,
                    center: {
                        x: (2 * x + 1) * this.donutWidth / 2 + (x + 1) * this.margin,
                        y: (2 * y + 1) * this.donutWidth / 2 + (y + 1) * this.margin,
                    },
                };

                drawDonut(
                    this.spritesCtx,
                    this.donuts[x][y]
                );
            }
        }
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
            donutState.color = getRandomColor();
            this.onDonutHit({ x: donutCoords.x, y: donutCoords.y });
        }
    }

    private getDonutCoords(coords: Coords): Coords {
        return {
            x: Math.floor(coords.x / (this.donutWidth + this.margin)),
            y: Math.floor(coords.y / (this.donutWidth +  this.margin)),
        };
    }

    private isDonutHit(donutState: DonutState, clickCoords: Coords): boolean {
        const { center, rotationAngle, segmentAngle } = donutState;
        const clickDistance = getDistance(center, clickCoords);
        const clickAngle = atan2Arc(getAngle(center, clickCoords));
        let { startAngle, endAngle } = donutState;

        startAngle = reduceAngle(startAngle + rotationAngle + 2 * Math.PI);
        endAngle = reduceAngle(endAngle + rotationAngle + 2 * Math.PI);

        const clickToEndSegmentAngle = reduceAngle(endAngle + 2 * Math.PI - clickAngle);

        return this.donutInnerRadius <= clickDistance
            && this.donutOuterRadius >= clickDistance
            && clickToEndSegmentAngle >= 0
            && clickToEndSegmentAngle <= segmentAngle;
    }
}
