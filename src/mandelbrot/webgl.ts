import { assert } from './utils/helpers'

// prettier-ignore
export const vertices = new Float32Array([
    // First triangle
    -1.0, -1.0, 0.0, 0.0, // Bottom left
     1.0, -1.0, 1.0, 0.0, // Bottom right
    -1.0,  1.0, 0.0, 1.0, // Top left

    // Second triangle
    -1.0,  1.0, 0.0, 1.0, // Top left
     1.0, -1.0, 1.0, 0.0, // Bottom right
     1.0,  1.0, 1.0, 1.0, // Top right
]);

export function loadShader(
	gl: WebGLRenderingContext,
	source: string,
	type: number
) {
	const shader = gl.createShader(type)
	assert(shader, 'Shader creation failed.')
	gl.shaderSource(shader, source)
	gl.compileShader(shader)

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(
			`An error occurred compiling the shaders: ${gl.getShaderInfoLog(
				shader
			)}`
		)
	}

	return shader
}

export function createShaderProgram(
	gl: WebGLRenderingContext,
	vsSource: string,
	fsSource: string
) {
	const vertexShader = loadShader(gl, vsSource, gl.VERTEX_SHADER)
	const fragShader = loadShader(gl, fsSource, gl.FRAGMENT_SHADER)

	const shaderProgram = gl.createProgram()
	assert(shaderProgram, 'Program creation failed.')

	gl.attachShader(shaderProgram, vertexShader)
	gl.attachShader(shaderProgram, fragShader)
	gl.linkProgram(shaderProgram)

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		throw new Error(
			`Unable to initialize the shader program: ${gl.getProgramInfoLog(
				shaderProgram
			)}`
		)
	}

	return shaderProgram
}
