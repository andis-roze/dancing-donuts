import {
    getRandomArbitrary,
    getRandomColor,
    isPowerOf2,
} from "../utils";
import { Donut } from "../common/Donut";
import { BasicShader } from "./shaders";
import { AbstractDonutContainer } from "../common/AbstractDonutContainer";

export interface DonutContainerProps {
    donutCountX: number;
    donutCountY: number;
    donutOuterRadius: number;
    donutInnerRadius: number;
}

export class DonutContainer3D extends AbstractDonutContainer {
    protected ctx: WebGLRenderingContext;
    private shader: BasicShader;
    private positionBuffer: WebGLBuffer;
    private textureCoordBuffer: WebGLBuffer;
    // private squareRotation = 0.0;

    private donut: Donut;

    public constructor(canvas: HTMLCanvasElement, props: Partial<DonutContainerProps>) {
        super(canvas, props);
        this.donutCountX = props.donutCountX || 20;
        this.donutCountY = props.donutCountY || 20;
        this.donutOuterRadius = props.donutOuterRadius || 25;
        this.donutInnerRadius = props.donutInnerRadius || 10;

        this.initCanvas(canvas);
        this.initDonut(props);
        this.initBuffers();
        this.initTexture();
        this.shader = new BasicShader(this.ctx);
        this.shader.use();
    }

    public destructor() {
        //
    }

    public  run(radiansPerSecond: number): void {
        /* -------------- RECTANGLE -------------- */
        const positionAttributeLocation = this.shader.getAttributeLocation("aPosition");
        const resolutionUniformLocation = this.shader.getUniformLocation("uResolution");

        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.positionBuffer);
        this.ctx.enableVertexAttribArray(positionAttributeLocation);
        this.ctx.vertexAttribPointer(positionAttributeLocation, 2, this.ctx.FLOAT, false, 0, 0);
        this.ctx.uniform2f(resolutionUniformLocation, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 6);

        /* -------------- TEXTURE -------------- */
        const colorUniformLocation = this.shader.getUniformLocation("uColor");
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.textureCoordBuffer);
        this.ctx.vertexAttribPointer(
            this.shader.getAttributeLocation("aTextureCoord"), 2, this.ctx.FLOAT, false, 0, 0
        );
        this.ctx.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
        this.ctx.enableVertexAttribArray(this.shader.getAttributeLocation("aTextureCoord"));
        this.ctx.activeTexture(this.ctx.TEXTURE0);
        this.ctx.uniform1i(this.shader.getUniformLocation("uSampler"), 0);
        this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, 0, 6);
    }

    protected initDonutState(): void {
        //
    }

    protected drawDonut(x: number, y: number): void {
        //
    }

    private initCanvas(canvas: HTMLCanvasElement) {
        const donutDiameter = 2 * this.donutOuterRadius;
        const canvasWidth = `${this.donutCountX * donutDiameter}`;
        const canvasHeight = `${this.donutCountY * donutDiameter}`;
        const ctx = canvas.getContext("webgl");

        if (!ctx) {
            throw new Error("Canvas 3D rendering context failed to initialise!");
        }

        this.canvas = canvas;
        this.canvas.setAttribute("width", canvasWidth);
        this.canvas.setAttribute("height", canvasHeight);

        this.ctx = ctx;
        this.ctx.viewport(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.clearColor(0, 0, 0, 0);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
    }

    private initDonut(props: Partial<DonutContainerProps>) {
        const startAngle = getRandomArbitrary(0, Math.PI / 2);
        const endAngle = startAngle + getRandomArbitrary(Math.PI / 2, 2 * Math.PI);

        this.donut = new Donut({
            startAngle,
            endAngle,
            color: getRandomColor(),
            innerRadius: this.donutInnerRadius,
            outerRadius: this.donutOuterRadius,
        });
    }

    private setRectangle(x: number, y: number): void {
        const donutDiameter = 2 * this.donutOuterRadius;
        const x1 = x;
        const x2 = x + donutDiameter;
        const y1 = y;
        const y2 = y + donutDiameter;
        this.ctx.bufferData(
            this.ctx.ARRAY_BUFFER,
            new Float32Array([
                x1, y1,
                x2, y1,
                x1, y2,
                x1, y2,
                x2, y1,
                x2, y2,
            ]),
            this.ctx.STATIC_DRAW
        );
    }

    private initBuffers() {
        /* -------------- RECTANGLE -------------- */
        const positionBuffer = this.ctx.createBuffer();

        if (!positionBuffer) {
            throw new Error("Position buffer failed to initialise!");
        }

        this.positionBuffer = positionBuffer;
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.positionBuffer);
        this.setRectangle(0, 0);

        /* -------------- TEXTURE -------------- */
        const textureCoordBuffer = this.ctx.createBuffer();

        if (!textureCoordBuffer) {
            throw new Error("Texture coordinate buffer failed to initialise!");
        }

        this.textureCoordBuffer = textureCoordBuffer;
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.textureCoordBuffer);

        const textureCoordinates = [
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0,
        ];

        this.ctx.bufferData(
            this.ctx.ARRAY_BUFFER,
            new Float32Array(textureCoordinates),
            this.ctx.STATIC_DRAW
        );
    }

    private initTexture() {
        const texture = this.ctx.createTexture();
        const image = this.donut.getImage();
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture);
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
            this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_S, this.ctx.CLAMP_TO_EDGE);
            this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_T, this.ctx.CLAMP_TO_EDGE);
            this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.LINEAR);
        }
    }
}
