import { Donut, DonutProps } from "./Donut";
import { getRandomColor, atan2Arc, getAngle, getDistance } from "./utils";
import { ClockWise, Coords } from "./types";

interface DonutContainerProps {
    clockWise?: ClockWise;
    startAngle?: number;
    endAngle?: number;
    donutCountX?: number;
    donutCountY?: number;
    donutOuterRadius?: number;
    donutInnerRadius?: number;
    fps?: number;
}

interface DonutContainerDefaultProps {
    clockWise: ClockWise;
    startAngle: number;
    endAngle: number;
    donutCountX: number;
    donutCountY: number;
    donutOuterRadius: number;
    donutInnerRadius: number;
    fps: number;
}

export class DonutContainer {
    public lastDonutHit: {
        donut: Donut,
        clickCoords: Coords,
        donutCoords: Coords,
    } | undefined;
    public donuts: Donut[][] = [];
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private canvasRect: ClientRect;
    private props: DonutContainerDefaultProps = {
        clockWise: 1,
        startAngle: Math.PI * 0.5,
        endAngle: Math.PI * 2,
        donutCountX: 20,
        donutCountY: 20,
        donutOuterRadius: 25,
        donutInnerRadius: 10,
        fps: 60,
    };

    public constructor (canvas: HTMLCanvasElement, props?: DonutContainerProps) {
        this.props = { ...this.props, ...props };
        const donutDiameter = 2 * this.props.donutOuterRadius;
        const canvasWidth = `${this.props.donutCountX * donutDiameter}`;
        const canvasHeight = `${this.props.donutCountY * donutDiameter}`;

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.canvas.setAttribute("width", canvasWidth);
        this.canvas.setAttribute("height", canvasHeight);
        this.canvas.addEventListener("click", this.onClick);

        for (let x = 0; x < this.props.donutCountX; x++) {
            this.donuts[x] = [];
            for (let y = 0; y < this.props.donutCountY; y++) {
                const center: Coords = {
                    x: (2 * x + 1) * this.props.donutOuterRadius,
                    y: (2 * y + 1) * this.props.donutOuterRadius
                };
                this.donuts[x][y] = new Donut({
                    clockWise: 1,
                    center,
                    startAngle: this.props.startAngle,
                    endAngle: this.props.endAngle,
                    color: getRandomColor(),
                    innerRadius: this.props.donutInnerRadius,
                    outerRadius: this.props.donutOuterRadius,
                });
            }
        }
    }

    public run(radiansPerSecond: number): void {
        let lastRender = performance.now();
        let pendingAnimationFrame: number | undefined;
        const renderLoop = (time: number) => {
            if (pendingAnimationFrame) {
                window.cancelAnimationFrame(pendingAnimationFrame);
                pendingAnimationFrame = undefined;
            }
            const delta = (time - lastRender) / 1000;
            lastRender = time;

            const step = radiansPerSecond * delta;

            if (this.ctx) {
                this.ctx.save();
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }

            this.donuts.forEach((row: Donut[]) => {
                row.forEach((donut: Donut) => {
                    if (this.ctx) {
                        const {
                            canvas,
                            clockWise,
                            center,
                        }: DonutProps & { canvas: HTMLCanvasElement } = donut.getProps();

                        donut.rotate(clockWise * step);
                        this.ctx.drawImage(
                            canvas,
                            center.x - this.props.donutOuterRadius,
                            center.y - this.props.donutOuterRadius
                        );
                    }
                });
            });

            if (this.ctx) {
                this.ctx.restore();
            }

            pendingAnimationFrame = window.requestAnimationFrame(renderLoop);
        };

        pendingAnimationFrame = window.requestAnimationFrame(renderLoop);
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
        const donut = this.donuts[donutCoords.x][donutCoords.y];
        this.lastDonutHit = undefined;

        if (this.isDonutHit(donut, clickCoords)) {
            donut.toggleClockwise();
            donut.setColor(getRandomColor());
            this.lastDonutHit = { donut, clickCoords, donutCoords };
        }
    }

    private getDonutCoords(coords: Coords): Coords {
        return {
            x: Math.floor(coords.x / 2 / this.props.donutOuterRadius),
            y: Math.floor(coords.y / 2 / this.props.donutOuterRadius),
        };
    }

    private isDonutHit(donut: Donut, clickCoords: Coords): boolean {
        const props: DonutProps & { canvas: HTMLCanvasElement } = donut.getProps();
        const clickDistance = getDistance(props.center, clickCoords);
        const startIsBigger = props.startAngle > props.endAngle;
        let clickAngle = atan2Arc(getAngle(props.center, clickCoords));

        clickAngle = startIsBigger && clickAngle < props.endAngle
            ? 2 * Math.PI + clickAngle
            : clickAngle;

        return this.props.donutInnerRadius <= clickDistance
            && this.props.donutOuterRadius >= clickDistance
            && clickAngle >= props.startAngle
            && clickAngle <= (startIsBigger ? 2 * Math.PI + props.endAngle : props.endAngle);
    }
}
