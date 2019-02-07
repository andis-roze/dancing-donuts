import { mat4 } from "gl-matrix";
import { isPowerOf2, getRandomArbitrary } from "../utils";
import { BasicShader } from "./shaders";
import { Donut } from "../common/Donut";

export class Quad {
    protected donutTexture: WebGLTexture;
    private donut: Donut;
    private canvas: HTMLCanvasElement;
    private ctx: WebGLRenderingContext;
    private shader: BasicShader;
    private positionBuffer: WebGLBuffer;
    private textureCoordBuffer: WebGLBuffer;
    private squareRotation = 0.0;

    public constructor(canvas: HTMLCanvasElement) {
        const startAngle = Math.PI * getRandomArbitrary(0, 1.5);
        const endAngle = Math.PI * getRandomArbitrary(1.5, 2);

        this.canvas = canvas;
        this.canvas.setAttribute("width", "1000");
        this.canvas.setAttribute("height", "1000");
        const ctx = canvas.getContext("webgl");

        if (!ctx) {
            throw new Error("Canvas 3d rendering context failed to initialise!");
        }

        this.ctx = ctx;
        this.ctx.viewport(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.donut = new Donut({
            startAngle,
            endAngle,
            color: "white",
            innerRadius: 10,
            outerRadius: 25,
        });

        this.shader = new BasicShader(this.ctx);
        this.initBuffers();
        this.loadTexture();
    }

    public destructor() {
        //
    }

    public run(): void {
        let then = 0;

        const render = (now: number) => {
            now *= 0.001;
            const deltaTime = now - then;
            then = now;

            this.drawScene();
            this.squareRotation += deltaTime;

            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }

    private initBuffers() {
        /* -------------- Quad -------------- */
        const positionBuffer = this.ctx.createBuffer();

        if (!positionBuffer) {
            throw new Error("Position buffer failed to initialise!");
        }

        this.positionBuffer = positionBuffer;
        const positions = [
            -1.0,  1.0,
            -1.0, -1.0,
             1.0,  1.0,
             1.0, -1.0
        ];

        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.positionBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER,
                      new Float32Array(positions),
                      this.ctx.STATIC_DRAW);

        /* -------------- Texture -------------- */
        const textureCoordBuffer = this.ctx.createBuffer();

        if (!textureCoordBuffer) {
            throw new Error("Position buffer failed to initialise!");
        }

        this.textureCoordBuffer = textureCoordBuffer;
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.textureCoordBuffer);

        const textureCoordinates = [
            0.0,  1.0,
            0.0,  0.0,
            1.0,  1.0,
            1.0,  0.0,
        ];

        this.ctx.bufferData(
            this.ctx.ARRAY_BUFFER,
            new Float32Array(textureCoordinates),
            this.ctx.STATIC_DRAW
        );
    }

    private loadTexture() {
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

    private drawScene() {
        this.ctx.clearColor(0, 0, 0, 0);
        this.ctx.clearDepth(1.0);
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.depthFunc(this.ctx.LEQUAL);
        // tslint:disable-next-line
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);

        const fieldOfView = 45 * Math.PI / 180;
        const aspect = this.ctx.canvas.clientWidth / this.ctx.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        mat4.perspective(
            projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar
        );

        const modelViewMatrix = mat4.create();

        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            [-0.0, 0.0, -6.0]
        );
        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.squareRotation,
            [0, 0, 1]
        );

        {
            const numComponents = 2;
            const type = this.ctx.FLOAT;
            const normalize = false;
            const stride = 0;

            const offset = 0;
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.positionBuffer);
            this.ctx.vertexAttribPointer(
                this.shader.getAttributeLocation("aVertexPosition"),
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            this.ctx.enableVertexAttribArray(
                this.shader.getAttributeLocation("aVertexPosition"));
        }

        {
            const numComponents = 2;
            const type = this.ctx.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.textureCoordBuffer);
            this.ctx.vertexAttribPointer(
                this.shader.getAttributeLocation("aTextureCoord"),
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            this.ctx.enableVertexAttribArray(this.shader.getAttributeLocation("aTextureCoord"));
          }

        this.shader.use();

        // Set the shader uniforms

        this.ctx.uniformMatrix4fv(
            this.shader.getUniformLocation("uProjectionMatrix"),
            false,
            projectionMatrix);
        this.ctx.uniformMatrix4fv(
            this.shader.getUniformLocation("uModelViewMatrix"),
            false,
            modelViewMatrix
        );

        this.ctx.activeTexture(this.ctx.TEXTURE0);

        this.ctx.uniform1i(this.shader.getUniformLocation("uSampler"), 0);

        {
            const offset = 0;
            const vertexCount = 4;
            this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, offset, vertexCount);
        }
    }
}
