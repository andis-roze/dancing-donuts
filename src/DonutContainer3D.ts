import { AbstractDonutContainer, DonutContainerProps } from "./common/AbstractDonutContainer";
import {
    m3,
    isPowerOf2,
    reduceAngle,
    splitHexColor,
 } from "./utils";
import { BasicShader } from "./shaders/basic/BasicShader";

export class DonutContainer3D extends AbstractDonutContainer {
    protected ctx: WebGLRenderingContext;
    private shader!: BasicShader;
    private rotationUniformLocation!: WebGLUniformLocation;
    private positionAttributeLocation!: number;
    private projectionUniformLocation!: WebGLUniformLocation;
    private colorUniformLocation!: WebGLUniformLocation;
    private textureCoordAttributeLocation!: number;
    private samplerUniformLocation!: WebGLUniformLocation;
    private donutBuffer!: WebGLBuffer;
    private initialRotation = 0;
    private texture: WebGLTexture;

    public constructor(props: DonutContainerProps) {
        super(props);
        const ctx = this.canvas.getContext("webgl");

        if (!ctx) {
            throw new Error("Canvas WebGL rendering context failed to initialise!");
        }

        const texture = ctx.createTexture();

        if (!texture) {
            throw new Error("Texture failed to initialise!");
        }

        this.ctx = ctx;
        this.texture = texture;
        this.initCanvas(this.canvas);
        this.initShader();
        this.initTexture(0, 0);
        this.initBuffers();
    }

    public draw(step: number): void {
        this.ctx.clearColor(0, 0, 0, 0);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
        this.donuts.forEach(
            (row, x) => {
                row.forEach(
                    (donutState, y) => {
                        const color = splitHexColor(donutState.color);
                        this.ctx.uniform4f(
                            this.colorUniformLocation,
                            color[0],
                            color[1],
                            color[2],
                            1
                        );
                        donutState.rotationAngle = reduceAngle(
                            donutState.rotationAngle + step * donutState.clockwise
                        );
                        const translationMatrix = m3.translation(
                            (2 * x + 1) * this.donutOuterRadius,
                            (2 * y + 1) * this.donutOuterRadius
                        );
                        const undoTranslationMatrix = m3.translation(
                            -this.donutOuterRadius,
                            -this.donutOuterRadius
                        );
                        const rotationMatrix = m3.multiply(
                            translationMatrix,
                            m3.rotation(
                                donutState.rotationAngle
                            )
                        );

                        this.ctx.uniformMatrix3fv(
                            this.rotationUniformLocation,
                            false,
                            m3.multiply(
                                rotationMatrix,
                                undoTranslationMatrix
                            )
                        );
                        this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 6);
                    }
                );
            }
        );
    }

    private initCanvas(canvas: HTMLCanvasElement) {
        const donutDiameter = 2 * this.donutOuterRadius;
        const canvasWidth = `${this.donutCountX * donutDiameter}`;
        const canvasHeight = `${this.donutCountY * donutDiameter}`;
        const ctx = canvas.getContext("webgl");

        if (!ctx) {
            throw new Error(
                "Canvas 3D rendering context failed to initialise!"
            );
        }

        this.canvas = canvas;
        this.canvas.setAttribute("width", canvasWidth);
        this.canvas.setAttribute("height", canvasHeight);

        this.ctx = ctx;
        this.ctx.viewport(
            0,
            0,
            this.ctx.canvas.width,
            this.ctx.canvas.height
        );

        this.ctx.enable(this.ctx.BLEND);
        this.ctx.blendFunc(this.ctx.ONE, this.ctx.ONE);
        this.ctx.disable(this.ctx.DEPTH_TEST);
        this.ctx.clearColor(0, 0, 0, 0);
        // tslint:disable-next-line:no-bitwise
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    }

    private initShader() {
        this.shader = new BasicShader(this.ctx);
        this.shader.use();

        this.positionAttributeLocation = this.shader.getAttributeLocation("aPosition");
        this.projectionUniformLocation = this.shader.getUniformLocation("uProjection");
        this.rotationUniformLocation = this.shader.getUniformLocation("uRotation");
        this.colorUniformLocation = this.shader.getUniformLocation("uColor");
        this.textureCoordAttributeLocation = this.shader.getAttributeLocation("aTextureCoord");
        this.samplerUniformLocation = this.shader.getUniformLocation("uSampler");
    }

    private initTexture(x: number, y: number) {
        // TODO: !!!
        const image = this.donut.draw({
            ...this.donuts[x][y],
            innerRadius: this.donutInnerRadius,
            outerRadius: this.donutOuterRadius,
        });
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.texture);
        this.ctx.texImage2D(
            this.ctx.TEXTURE_2D,
            0,
            this.ctx.RGBA,
            this.ctx.RGBA,
            this.ctx.UNSIGNED_BYTE,
            image
        );

        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            this.ctx.generateMipmap(this.ctx.TEXTURE_2D);
        } else {
            this.ctx.texParameteri(
                this.ctx.TEXTURE_2D,
                this.ctx.TEXTURE_WRAP_S,
                this.ctx.CLAMP_TO_EDGE
            );
            this.ctx.texParameteri(
                this.ctx.TEXTURE_2D,
                this.ctx.TEXTURE_WRAP_T,
                this.ctx.CLAMP_TO_EDGE
            );
            this.ctx.texParameteri(
                this.ctx.TEXTURE_2D,
                this.ctx.TEXTURE_MIN_FILTER,
                this.ctx.LINEAR
            );
        }
    }

    private initBuffers() {
        const donutBuffer = this.ctx.createBuffer();

        if (!donutBuffer) {
            throw new Error("Donut buffer failed to initialise!");
        }

        this.donutBuffer = donutBuffer;
        this.ctx.bindBuffer(
            this.ctx.ARRAY_BUFFER,
            this.donutBuffer
        );
        this.setGeometry(0.0, 0.0);

        /* -------------- RECTANGLE -------------- */
        this.ctx.vertexAttribPointer(
            this.positionAttributeLocation,
            2,
            this.ctx.FLOAT,
            false,
            4 * 4,
            0
        );
        this.ctx.enableVertexAttribArray(
            this.positionAttributeLocation
        );
        this.ctx.uniformMatrix3fv(
            this.projectionUniformLocation,
            false,
            m3.projection(
                this.canvas.clientWidth,
                 this.canvas.clientHeight
            )
        );
        this.ctx.uniformMatrix3fv(
            this.rotationUniformLocation,
            false,
            m3.rotation(this.initialRotation)
        );

        /* -------------- TEXTURE -------------- */
        this.ctx.vertexAttribPointer(
            this.textureCoordAttributeLocation,
            2,
            this.ctx.FLOAT,
            false,
            4 * 4,
            2 * 4
        );
        this.ctx.enableVertexAttribArray(
            this.textureCoordAttributeLocation
        );
        this.ctx.activeTexture(this.ctx.TEXTURE0);
        this.ctx.uniform1i(this.samplerUniformLocation, 0);
        this.ctx.uniform4f(
            this.colorUniformLocation,
            Math.random(),
            Math.random(),
            Math.random(),
            1
        );
    }

    private setGeometry(x: number, y: number): void {
        const donutDiameter = 2 * this.donutOuterRadius;
        const x1 = x;
        const x2 = x + donutDiameter;
        const y1 = y;
        const y2 = y + donutDiameter;
        this.ctx.bufferData(
            this.ctx.ARRAY_BUFFER,
            new Float32Array([
                x1,  y1, 0.0, 0.0,
                x2,  y1, 1.0, 0.0,
                x1,  y2, 0.0, 1.0,
                x1,  y2, 0.0, 1.0,
                x2,  y1, 1.0, 0.0,
                x2,  y2, 1.0, 1.0
            ]),
            this.ctx.STATIC_DRAW
        );
    }
}
