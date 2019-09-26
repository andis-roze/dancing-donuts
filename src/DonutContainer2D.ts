import { AbstractDonutContainer, DonutContainerProps } from "./common/AbstractDonutContainer";
import { reduceAngle } from "./utils";

export class DonutContainer2D extends AbstractDonutContainer {
    protected ctx: CanvasRenderingContext2D;

    public constructor(props: DonutContainerProps) {
        super(props);
        const ctx = this.canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Canvas 2d rendering context failed to initialise!");
        }

        this.ctx = ctx;
    }

    public draw(step: number): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.donuts.forEach((row, x) => {
            row.forEach((donutState, y: number) => {
                donutState.rotationAngle = reduceAngle(
                    donutState.rotationAngle + step * donutState.clockwise
                );
                this.ctx.save();
                this.ctx.translate(
                    (2 * x + 1) * this.donutOuterRadius,
                    (2 * y + 1) * this.donutOuterRadius
                );
                this.ctx.rotate(donutState.rotationAngle);
                this.ctx.drawImage(
                    this.sprites,
                    2 * x * this.donutOuterRadius,
                    2 * y * this.donutOuterRadius,
                    2 * this.donutOuterRadius,
                    2 * this.donutOuterRadius,
                    -this.donutOuterRadius,
                    -this.donutOuterRadius,
                    2 * this.donutOuterRadius,
                    2 * this.donutOuterRadius
                );
                this.ctx.restore();
            });
        });
    }
}
