#version 300 es

in vec2 vPos;

void main() {
    gl_Position = vec4(vPos, 0.0f, 1.0f);
}