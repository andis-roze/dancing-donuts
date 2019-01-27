import * as VertexShader from "!raw-loader!./VertexShader.glsl";
import * as FragmentShader from "!raw-loader!./FragmentShader.glsl";
import { AbstractShader } from "../AbstractShader";

export class BasicShader extends AbstractShader {
    constructor(ctx: WebGLRenderingContext) {
        super("basic", ctx);

        this.load(VertexShader, FragmentShader);
    }
}
