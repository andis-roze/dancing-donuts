import { AbstractDonutContainer, DonutContainerProps } from "./common/AbstractDonutContainer";
import {
    m3,
    isPowerOf2,
    reduceAngle,
    splitHexColor,
    mapValueToInterval,
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
    private positionBuffer!: WebGLBuffer;
    private texCoordBuffer!: WebGLBuffer;
    private initialRotation = 0;
    private texture!: WebGLTexture;

    public constructor(props: DonutContainerProps) {
        super(props);
        const ctx = this.canvas.getContext("webgl");

        if (!ctx) {
            throw new Error("Canvas WebGL rendering context failed to initialise!");
        }

        this.ctx = ctx;
        this.initCanvas(this.canvas);
        this.initShader();
        this.initTextureCoords();
        this.initPositionCoords();
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

    private initTextureCoords() {
        const texture = this.ctx.createTexture();

        if (!texture) {
            throw new Error("Texture failed to initialise!");
        }

        this.texture = texture;
        const texCoordBuffer = this.ctx.createBuffer();
        const texCoords: number[] = [];

        if (!texCoordBuffer) {
            throw new Error("Texture coordinate buffer failed to initialise!");
        }

        this.texCoordBuffer = texCoordBuffer;
        this.ctx.bindBuffer(
            this.ctx.ARRAY_BUFFER,
            this.texCoordBuffer
        );
        // TODO: init tex coord buffer
        const margin = mapValueToInterval(this.margin, 0, this.canvas.width, 0, 1);
        const width = mapValueToInterval(this.donutWidth, 0, this.canvas.width, 0, 1);

        // for (let x = 0; x < this.donutCountX; x++) {
        //     for (let y = 0; y < this.donutCountY; y++) {
        texCoords.push(
            margin, margin,
            width, margin,
            margin, width,
            margin, width,
            width, margin,
            width, width
        );
        //     }
        // }

        this.ctx.bufferData(
            this.ctx.ARRAY_BUFFER,
            new Float32Array(texCoords),
            this.ctx.STATIC_DRAW
        );

        this.ctx.vertexAttribPointer(
            this.textureCoordAttributeLocation,
            2,
            this.ctx.FLOAT,
            false,
            0,
            0
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
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.texture);
        this.ctx.texImage2D(
            this.ctx.TEXTURE_2D,
            0,
            this.ctx.RGBA,
            this.ctx.RGBA,
            this.ctx.UNSIGNED_BYTE,
            this.sprites
        );

        if (isPowerOf2(this.sprites.width) && isPowerOf2(this.sprites.height)) {
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

    private initPositionCoords() {
        const x1 = this.margin;
        const x2 = this.margin + this.donutWidth;
        const y1 = this.margin;
        const y2 = this.margin + this.donutWidth;
        const positionBuffer = this.ctx.createBuffer();

        if (!positionBuffer) {
            throw new Error("Position buffer failed to initialise!");
        }

        this.positionBuffer = positionBuffer;
        this.ctx.bindBuffer(
            this.ctx.ARRAY_BUFFER,
            this.positionBuffer
        );
        this.ctx.bufferData(
            this.ctx.ARRAY_BUFFER,
            new Float32Array([
                x1,  y1,
                x2,  y1,
                x1,  y2,
                x1,  y2,
                x2,  y1,
                x2,  y2,
            ]),
            this.ctx.STATIC_DRAW
        );
        this.ctx.vertexAttribPointer(
            this.positionAttributeLocation,
            2,
            this.ctx.FLOAT,
            false,
            2 * 4,
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
    }
}
