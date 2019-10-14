export interface DonutProps {
    color: string;
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    outerRadius: number;
    border: number;
}

export class Donut {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private color: string;
    private startAngle: number;
    private endAngle: number;
    private innerRadius: number;
    private outerRadius: number;
    private border: number;

    constructor(props: DonutProps) {
        this.canvas = document.createElement("canvas");
        this.border = props.border;
        const ctx = this.canvas.getContext("2d");
        const width = 2 * (props.outerRadius + this.border);

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

    public setColor = (color: string) => {
        this.color = color;
        return this.draw();
    }

    private draw() {
        this.ctx.clearRect(-1, -1, this.canvas.width + 1, this.canvas.height + 1);
        // Reset current transformation matrix to the identity matrix
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = this.color;
        this.ctx.lineWidth = this.border;
        this.ctx.beginPath();
        this.ctx.translate(this.border, this.border);
        // Outer arc: clockwise
        this.ctx.arc(
            this.outerRadius,
            this.outerRadius,
            this.outerRadius,
            this.startAngle,
            this.endAngle,
            false
            );
        // Inner arc: counter clockwise
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
