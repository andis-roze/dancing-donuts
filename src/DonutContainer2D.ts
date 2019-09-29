import { AbstractDonutContainer, DonutContainerProps } from "./common/AbstractDonutContainer";
import { Donut } from "./common/Donut";
import { reduceAngle } from "./utils";
import { Coords } from "./common/types";

export class DonutContainer2D extends AbstractDonutContainer {
    protected ctx: CanvasRenderingContext2D;

    public constructor(props: DonutContainerProps) {
        super(props);
        const ctx = this.canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Canvas 2d rendering context failed to initialise!");
        }

        this.ctx = ctx;
        // TODO: Ugly hack. Try to come up with better approach to change 2D donut color
        // @ts-ignore
        window.addEventListener("donutHit", this.donutHit);
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

    private donutHit = (e: CustomEvent<Coords>) => {
        const { x, y } = e.detail;
        const { color, startAngle, endAngle } = this.donuts[x][y];
        const donut = new Donut({
            color,
            startAngle,
            endAngle,
            innerRadius: this.donutInnerRadius,
            outerRadius: this.donutOuterRadius,
            border: this.border,
        });
        this.spritesCtx.drawImage(
            donut.getSprite(),
            0,
            0,
            2 * (this.donutOuterRadius + this.border),
            2 * (this.donutOuterRadius + this.border),
            2 * x * this.donutOuterRadius,
            2 * y * this.donutOuterRadius,
            2 * this.donutOuterRadius,
            2 * this.donutOuterRadius
        );
    }
}
