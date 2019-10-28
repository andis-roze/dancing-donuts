import { AbstractDonutContainer, DonutContainerProps } from "./common/AbstractDonutContainer";
import { reduceAngle, drawDonut } from "./utils";
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
                    donutState.center.x,
                    donutState.center.y
                );
                this.ctx.rotate(donutState.rotationAngle);
                this.ctx.drawImage(
                    this.sprites,
                    x * this.donutWidth + x * this.margin,
                    y * this.donutWidth + y * this.margin,
                    this.donutWidth,
                    this.donutWidth,
                    x * this.donutWidth - donutState.center.x + (x + 1) * this.margin,
                    y * this.donutWidth - donutState.center.y + (y + 1) * this.margin,
                    this.donutWidth,
                    this.donutWidth
                );
                this.ctx.restore();
            });
        });
    }

    private donutHit = (e: CustomEvent<Coords>) => {
        const { x, y } = e.detail;
        drawDonut(
            this.spritesCtx,
            this.donuts[x][y]
        );
    }
}
