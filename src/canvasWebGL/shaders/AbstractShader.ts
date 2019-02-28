export abstract class AbstractShader {
    private name: string;
    private ctx: WebGLRenderingContext;
    private program: WebGLProgram;
    private attributes: { [name: string]: GLint } = {};
    private uniforms: { [name: string]: WebGLUniformLocation } = {};

    constructor(name: string, ctx: WebGLRenderingContext) {
        this.name = name;
        this.ctx = ctx;
    }

    public getName(): string {
        return this.name;
    }

    public use(): void {
        this.ctx.useProgram(this.program);
    }

    public getAttributeLocation(name: string): number {
        if (this.attributes[name] === undefined) {
            throw new Error(`Unable to find attribute named "${name}" in shader named ${this.name}`);
        }

        return this.attributes[name];
    }

    public getUniformLocation(name: string): WebGLUniformLocation {
        if (this.uniforms[name] === undefined) {
            throw new Error(`Unable to find uniform named "${name}" in shader named ${this.name}`);
        }

        return this.uniforms[name];
    }

    protected load(vertexSource: string, fragmentSource: string): void {
        const vertexShader = this.loadShader(vertexSource, this.ctx.VERTEX_SHADER);
        const fragmentShader = this.loadShader(fragmentSource, this.ctx.FRAGMENT_SHADER);

        this.createProgram(vertexShader, fragmentShader);

        this.getAttributes();
        this.getUniforms();
    }

    private loadShader(source: string, shaderType: number): WebGLShader {
        const shader: WebGLShader | null = this.ctx.createShader(shaderType);

        if (!shader) {
            throw new Error(
                `${
                    shaderType === this.ctx.VERTEX_SHADER
                    ? "Vertex"
                    : "Fragment"} shader failed to initialise!`
            );
        }

        this.ctx.shaderSource(shader, source);
        this.ctx.compileShader(shader);
        const error = this.ctx.getShaderInfoLog(shader)!.trim();

        if (error !== "") {
            throw new Error(`Error compiling shader "${this.name}": ${error}`);
        }

        return shader;
    }

    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
        const program = this.ctx.createProgram();

        if (!program) {
            throw new Error("Shader program failed to initialise!");
        }

        this.program = program;
        this.ctx.attachShader(this.program, vertexShader);
        this.ctx.attachShader(this.program, fragmentShader);
        this.ctx.linkProgram(this.program);

        const error = this.ctx.getProgramInfoLog(this.program)!.trim();

        if (error !== "") {
            throw new Error(`Error linking shader "${this.name}": ${error}`);
        }
    }

    private getAttributes(): void {
        if (!this.program) {
            throw new Error("Shader program failed to initialise!");
        }

        const attributeCount = this.ctx.getProgramParameter(this.program, this.ctx.ACTIVE_ATTRIBUTES);

        for (let i = 0; i < attributeCount; ++i) {
            const info: WebGLActiveInfo | null = this.ctx.getActiveAttrib(this.program, i);

            if (!info) {
                break;
            }

            this.attributes[info.name] = this.ctx.getAttribLocation(this.program, info.name);
        }
    }

    private getUniforms(): void {
        const uniformCount = this.ctx.getProgramParameter(this.program, this.ctx.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; ++i) {
            const info: WebGLActiveInfo | null = this.ctx.getActiveUniform(this.program, i);

            if (!info) {
                break;
            }

            const uniformLocation = this.ctx.getUniformLocation(this.program, info.name);

            if (!uniformLocation) {
                break;
            }

            this.uniforms[info.name] = uniformLocation;
        }
    }
}
