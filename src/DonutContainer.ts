import { Donut } from "./Donut";

interface DonutInstance {
    donut: Donut;
    startAngle: number;
    endAngle: number;
}

export class DonutContainer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private donutCountX = 20;
    private donutCountY = 20;
    private donutOuterRadius = 25;
    private donutInnerRadius = 10;
    private donuts: DonutInstance[] = [];
    private animationFrameId: number;

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

        for (let y = 0; y < this.donutCountY; y++) {
            for (let x = 0; x < this.donutCountX; x++) {
                const donut = new Donut({
                    center: {
                        x: (2 * x + 1) * this.donutOuterRadius,
                        y: (2 * y + 1) * this.donutOuterRadius
                    },
                    color: getRandomColor(),
                    ctx: this.ctx,
                    innerRadius: this.donutInnerRadius,
                    outerRadius: this.donutOuterRadius,
                });

                this.donuts.push({
                    donut,
                    startAngle,
                    endAngle,
                });
            }
        }
    }

    public run(): void {
        window.cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = window.requestAnimationFrame(() => {
            this.donuts.forEach((donutInstance: DonutInstance) => {
                donutInstance.donut.render({
                    startAngle: donutInstance.startAngle,
                    endAngle: donutInstance.endAngle,
                });
            });
        });
    }
}

function getRandomColor() {
    const digits = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += digits[Math.floor(Math.random() * 16)];
    }

    return color;
}
