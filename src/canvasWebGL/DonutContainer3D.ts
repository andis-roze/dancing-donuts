import {
    DonutContainerProps,
    AbstractDonutContainer
} from "../common/AbstractDonutContainer";
import { BasicShader } from "./shaders";

export class DonutContainer3D extends AbstractDonutContainer {
    protected ctx: WebGLRenderingContext;
    private shader: BasicShader;

    constructor(canvas: HTMLCanvasElement, props: Partial<DonutContainerProps>) {
        super(canvas, props);
        const ctx = canvas.getContext("webgl");

        if (!ctx) {
            throw new Error("Canvas 3d rendering context failed to initialise!");
        }

        this.ctx = ctx;
        this.ctx.viewport(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.clearColor(0, 0, 0, 0);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);

        this.shader = new BasicShader(this.ctx);
        this.shader.use();

        this.initDonutState();
    }

    public run(radiansPerSecond: number): void {
        // TODO: implement WebGL flavor
    }

    protected drawDonut(x: number, y: number): void {
        //
    }
}
