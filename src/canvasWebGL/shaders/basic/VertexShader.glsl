attribute highp vec2 aPosition;
attribute highp vec2 aTextureCoord;

uniform highp mat3 uProjection;
uniform highp mat3 uRotation;
// uniform highp mat3 uTranslation;

varying highp vec2 vTextureCoord;

void main() {
    gl_Position = vec4((uProjection /* * uTranslation */ * uRotation * vec3(aPosition, 1)).xy, 0, 1);
    vTextureCoord = aTextureCoord;
}
