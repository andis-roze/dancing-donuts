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

    constructor(props: DonutProps) {
        this.canvas = document.createElement("canvas");
        const ctx = this.canvas.getContext("2d");
        const width = 2 * props.outerRadius;

        if (!ctx) {
            throw new Error("Canvas 2d rendering context failed to initialise!");
        }

        this.ctx = ctx;
        this.canvas.width = width;
        this.canvas.height = width;
    }

    public draw(props: DonutProps) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = props.color;
        this.ctx.beginPath();
        // Outer arc: counter clockwise
        this.ctx.arc(
            props.outerRadius,
            props.outerRadius,
            props.outerRadius,
            props.startAngle,
            props.endAngle,
            false
            );
        // Inner arc: clockwise
        this.ctx.arc(
            props.outerRadius,
            props.outerRadius,
            props.innerRadius,
            props.endAngle,
            props.startAngle,
            true
            );
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        return this.canvas;
    }
}
