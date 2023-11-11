#version 300 es

precision highp float;

uniform vec2 canvas_size;
uniform vec2 zoom_factor;
uniform vec2 translation;

const float MAX_ITERS = 1000.0;
int SAMPLES = 17;

const float offsetsD = 0.5;
const float offsetsD2 = 0.25;
const float offsetsD3 = 0.125;
const float offsetsD4 = 0.075;
vec2 offsets[17] = vec2[17](
    vec2(0.0, 0.0),
    vec2(-offsetsD,-offsetsD),
    vec2(offsetsD,offsetsD),
    vec2(-offsetsD,offsetsD),
    vec2(offsetsD,-offsetsD),
    vec2(-offsetsD2,-offsetsD2),
    vec2(offsetsD2,offsetsD2),
    vec2(-offsetsD2,offsetsD2),
    vec2(offsetsD2,-offsetsD2),
    vec2(-offsetsD3,-offsetsD3),
    vec2(offsetsD3,offsetsD3),
    vec2(-offsetsD3,offsetsD3),
    vec2(offsetsD3,-offsetsD3),
    vec2(-offsetsD4,-offsetsD4),
    vec2(offsetsD4,offsetsD4),
    vec2(-offsetsD4,offsetsD4),
    vec2(offsetsD4,-offsetsD4)
);


vec4 coloring(float);

vec2 sqr(vec2 v) {
    return vec2(v.x * v.x - v.y * v.y, 2.0 * v.x * v.y);
}

float test_mandelbrot(vec2 c) {
    vec2 z = vec2(0.0, 0.0);
    vec2 old = vec2(0.0, 0.0);
    int period = 0;

    for (float i = 0.0; i < MAX_ITERS; ++i) {
        z = sqr(z) + c;
        if (z == old) {
            return 0.0;
        }
        
        float mag = dot(z, z);
        if (mag > 7.0) {
            float sl = i - log2(log2(mag)) + 4.0;
			return sl*0.0025;
        }

        if (period > 20) {
            period = 0;
            old = z;
        }
    }

    return 0.0;
}

vec2 to_vec_space(vec2 c) {
    float w = canvas_size.x;
    float h = canvas_size.y;
    float z1 = zoom_factor.x;
    float z2 = zoom_factor.y;
    float t1 = translation.x;
    float t2 = translation.y;


    return vec2(
        (4.0 * c.x - w * (t1 * z1 + 2.0)) / (z1 * w),
        (-4.0 * c.y - h * (t2 * z2 - 2.0)) / (z2 * h)
    );
}

out vec4 fragColor;

void main() {
    vec2 pixel_coords = vec2(gl_FragCoord.x, canvas_size.y - gl_FragCoord.y);

    vec4 outs = vec4(0.0);
    for(int i = 0; i < SAMPLES; i++) {        
        vec2 fragment = (pixel_coords+offsets[i]);    
        outs += coloring(test_mandelbrot(to_vec_space(fragment)));
    }
	fragColor = outs / float(SAMPLES);
}

vec4 coloring(float mcol) {
    return vec4(0.5 + 0.5*cos(2.7+mcol*30.0 + vec3(0.0,.6,1.0)),1.0);
}