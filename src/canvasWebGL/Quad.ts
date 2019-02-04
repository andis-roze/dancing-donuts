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
        const positionBuffer = this.ctx.createBuffer();
        const positions = [
          -1.0,  1.0,
           1.0,  1.0,
          -1.0, -1.0,
           1.0, -1.0,
        ];

        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, positionBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER,
                      new Float32Array(positions),
                      this.ctx.STATIC_DRAW);

        if (!positionBuffer) {
            throw new Error("Position buffer failed to initialise!");
        }

        this.positionBuffer = positionBuffer;
    }

    private loadTexture() {
        const texture = this.ctx.createTexture();
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture);

        this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture);
        this.ctx.texImage2D(
            this.ctx.TEXTURE_2D,
            0,
            this.ctx.RGBA,
            this.ctx.RGBA,
            this.ctx.UNSIGNED_BYTE,
            this.donut.getImage()
        );

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(this.donut.getImage().width) && isPowerOf2(this.donut.getImage().height)) {
            // Yes, it's a power of 2. Generate mips.
            this.ctx.generateMipmap(this.ctx.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
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

        const numComponents = 2;
        const type = this.ctx.FLOAT;
        const normalize = false;
        const stride = 0;

        let offset = 0;
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.positionBuffer);
        this.ctx.vertexAttribPointer(
            this.shader.getAttributeLocation("aVertexPosition"),
            numComponents,
            type,
            normalize,
            stride,
            offset);
        this.ctx.enableVertexAttribArray(
            this.shader.getAttributeLocation("aVertexPosition"));

        this.shader.use();

        // Set the shader uniforms

        this.ctx.uniformMatrix4fv(
            this.shader.getUniformLocation("uProjectionMatrix"),
            false,
            projectionMatrix);
        this.ctx.uniformMatrix4fv(
            this.shader.getUniformLocation("uModelViewMatrix"),
            false,
            modelViewMatrix);

        offset = 0;
        const vertexCount = 4;
        this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, offset, vertexCount);
    }
}
