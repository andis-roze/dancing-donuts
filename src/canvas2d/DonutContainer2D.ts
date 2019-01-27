import { reduceAngle } from "../utils";
import {
    DonutContainerProps,
    DonutState,
    DonutContainer
} from "../common/DonutContainer";

export class DonutContainer2D extends DonutContainer {
    constructor(canvas: HTMLCanvasElement, props: Partial<DonutContainerProps>) {
        super(canvas, props);
        this.ctx = canvas.getContext("2d");
        this.initDonutState();
    }

    public run(radiansPerSecond: number) {
        const ctx = this.ctx as CanvasRenderingContext2D;
        let lastRender = performance.now();
        const renderLoop = (time: number) => {
            if (!ctx) {
                throw new Error("Canvas 2d rendering context failed to initialise!");
            }

            const delta = (time - lastRender) / 1000;
            const step = radiansPerSecond * delta;
            lastRender = time;

            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.donuts.forEach((row: DonutState[], x: number) => {
                row.forEach((donutState: DonutState, y: number) => {
                    if (!ctx) {
                        throw new Error("Canvas 2d rendering context failed to initialise!");
                    }

                    donutState.rotationAngle = reduceAngle(donutState.rotationAngle + step * donutState.clockwise);
                    donutState.startAngle = reduceAngle(donutState.startAngle + step * donutState.clockwise);
                    donutState.endAngle = reduceAngle(donutState.endAngle + step * donutState.clockwise);
                    ctx.save();
                    ctx.translate(
                        (2 * x + 1) * this.donutOuterRadius,
                        (2 * y + 1) * this.donutOuterRadius
                        );
                    ctx.rotate(donutState.rotationAngle);
                    ctx.drawImage(
                        this.donuts[x][y].donut.getImage(),
                        -this.donutOuterRadius,
                        -this.donutOuterRadius
                    );
                    ctx.restore();
                });
            });

            window.requestAnimationFrame(renderLoop);
        };

        window.requestAnimationFrame(renderLoop);
    }

    protected drawDonut(x: number, y: number): void {
        const ctx = this.ctx as CanvasRenderingContext2D;
        if (!ctx) {
            throw new Error("Canvas 2d rendering context failed to initialise!");
        }

        ctx.drawImage(
            this.donuts[x][y].donut.getImage(),
            2 * x * this.donutOuterRadius,
            2 * y * this.donutOuterRadius
        );
    }
}
