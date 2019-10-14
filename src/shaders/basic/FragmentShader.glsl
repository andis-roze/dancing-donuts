varying highp vec2 vTextureCoord;

uniform highp sampler2D uSampler;
uniform highp vec4 uColor;

void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;
}
