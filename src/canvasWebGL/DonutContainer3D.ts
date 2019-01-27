import {
    DonutContainerProps,
    DonutContainer
} from "../common/DonutContainer";

export class DonutContainer3D extends DonutContainer {
    constructor(canvas: HTMLCanvasElement, props: Partial<DonutContainerProps>) {
        super(canvas, props);
        this.ctx = canvas.getContext("webgl");

        if (!this.ctx) {
            throw new Error("Canvas 3d rendering context failed to initialise!");
        }

        // this.ctx.clearColor(0.0, 0.0, 0.0, 0);
        // this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
        this.initDonutState();
    }

    public run(radiansPerSecond: number): void {
        // TODO: implement WebGL flavor
    }

    protected drawDonut(x: number, y: number): void {
        if (!this.ctx) {
            throw new Error("Canvas 3d rendering context failed to initialise!");
        }
    }
}
