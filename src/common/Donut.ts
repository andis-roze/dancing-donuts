import  { reduceAngle } from "../utils";

export interface DonutProps {
    color: string;
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    outerRadius: number;
}

export class Donut {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private color: string;
    private startAngle: number;
    private endAngle: number;
    private innerRadius: number;
    private outerRadius: number;

    constructor(props: DonutProps, dpr=1) {
        const width = 2 * props.outerRadius;

        this.canvas = document.createElement("canvas");
        const ctx = this.canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Canvas 2d rendering context failed to initialise!");
        }

        this.ctx = ctx;

        // https://www.html5rocks.com/en/tutorials/canvas/hidpi/
        this.canvas.width = width * dpr;
        this.canvas.height = width * dpr;
        this.ctx.scale(dpr, dpr);

        this.color = props.color;
        this.startAngle = reduceAngle(props.startAngle);
        this.endAngle = reduceAngle(props.endAngle);
        this.innerRadius = props.innerRadius;
        this.outerRadius = props.outerRadius;

        this.draw();
    }

    public getImage = () => this.canvas;

    public setColor = (color: string) => {
        this.color = color;
        this.draw();
    }

    private draw() {
        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        // Outer arc: counter clockwise
        this.ctx.arc(
            this.outerRadius,
            this.outerRadius,
            this.outerRadius,
            this.startAngle,
            this.endAngle,
            false
            );
        // Inner arc: clockwise
        this.ctx.arc(
            this.outerRadius,
            this.outerRadius,
            this.innerRadius,
            this.endAngle,
            this.startAngle,
            true
            );
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
}
