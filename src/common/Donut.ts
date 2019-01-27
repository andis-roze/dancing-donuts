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
    private ctx: CanvasRenderingContext2D | null;
    private color: string;
    private startAngle: number;
    private endAngle: number;
    private innerRadius: number;
    private outerRadius: number;

    constructor(props: DonutProps) {
        const width = 2 * props.outerRadius;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.setAttribute("width", `${width}`);
        this.canvas.setAttribute("height", `${width}`);

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
        // const { startAngle, endAngle, innerRadius, outerRadius } = this;
        if (this.ctx) {
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
}
