import {
    reduceAngle,
    getRandomDirection,
    getRandomArbitrary,
    getRandomColor,
} from "../utils";
import {
    DonutContainerProps,
    DonutState,
    AbstractDonutContainer,
} from "../common/AbstractDonutContainer";
import { Donut } from "../common/Donut";

export class DonutContainer2D extends AbstractDonutContainer {
    protected ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, props: Partial<DonutContainerProps>) {
        super(canvas, props);
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Canvas 2d rendering context failed to initialise!");
        }

        this.ctx = ctx;
        this.initDonutState();
    }

    public destructor() {
        this.canvas.removeEventListener("click", this.onClick);
    }

    public run(radiansPerSecond: number) {
        let lastRender = performance.now();
        const renderLoop = (time: number) => {

            const delta = (time - lastRender) / 1000;
            const step = radiansPerSecond * delta;
            lastRender = time;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.donuts.forEach((row: DonutState[], x: number) => {
                row.forEach((donutState: DonutState, y: number) => {
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

    protected initDonutState() {
        const startAngle = Math.PI * getRandomArbitrary(0, 1.5);
        const endAngle = Math.PI * getRandomArbitrary(1.5, 2);

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
                this.drawDonut(x, y);
            }
        }
    }

    protected drawDonut(x: number, y: number): void {
        this.ctx.drawImage(
            this.donuts[x][y].donut.getImage(),
            2 * x * this.donutOuterRadius,
            2 * y * this.donutOuterRadius
        );
    }
}
