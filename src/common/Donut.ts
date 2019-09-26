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
        this.color = props.color;
        this.startAngle = props.startAngle;
        this.endAngle = props.endAngle;
        this.innerRadius = props.innerRadius;
        this.outerRadius = props.outerRadius;
        this.draw();
    }

    public getSprite = () => this.canvas;

    private draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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

        return this.canvas;
    }
}
