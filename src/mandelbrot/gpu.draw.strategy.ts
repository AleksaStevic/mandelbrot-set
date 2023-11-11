import { Canvas } from './config'
import { translate, translationVector, zoom, zoomFactor } from './coords'
import { pressedKeys } from './events'
import { createShaderProgram, vertices } from './webgl'
import { vsSource, fsSource } from './shaders'
import { assert } from './utils/helpers'

/**
 * Draw using GPU.
 *
 * @param gl WebGL rendering context
 */
export function drawGPU(gl: WebGL2RenderingContext) {
	const offset = 0
	const vertexCount = 6
	gl.clearColor(0, 0, 0, 1)

	const program = createShaderProgram(gl, vsSource, fsSource)

	const vertexBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
	const positionLocation = gl.getAttribLocation(program, 'vPos')
	gl.enableVertexAttribArray(positionLocation)
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 4 * 4, 0)

	const canvasSizeLoc = gl.getUniformLocation(program, 'canvas_size')
	const zoomFactorLoc = gl.getUniformLocation(program, 'zoom_factor')
	const translationLoc = gl.getUniformLocation(program, 'translation')

	gl.useProgram(program)

	const fpsP = document.getElementById('fps')
	assert(fpsP, 'FPS element not found.')

	let lastFrame = 0
	let frame = 0

	setInterval(() => {
		const fps = (frame - lastFrame + 1) * 2
		fpsP.textContent = fps.toString()
		lastFrame = frame
	}, 500)

	let prevTime = performance.now()

	requestAnimationFrame(function loop() {
		const currentTime = performance.now()
		const deltaTime = (currentTime - prevTime) / 1000
		prevTime = currentTime
		frame += 1
		moveWithKeyboard(deltaTime)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		gl.uniform2fv(canvasSizeLoc, Canvas.Size)
		gl.uniform2fv(zoomFactorLoc, zoomFactor)
		gl.uniform2fv(translationLoc, translationVector)
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
		requestAnimationFrame(loop)
	})
}

function moveWithKeyboard(deltaTime: number) {
	if (pressedKeys.has('a')) {
		translate(5 * deltaTime, 0)
	}

	if (pressedKeys.has('d')) {
		translate(-5 * deltaTime, 0)
	}

	if (pressedKeys.has('w')) {
		translate(0, -5 * deltaTime)
	}

	if (pressedKeys.has('s')) {
		translate(0, 5 * deltaTime)
	}

	// ZOOM:
	if (pressedKeys.has('q')) {
		zoom(1 + 1 * deltaTime)
	}

	if (pressedKeys.has('e')) {
		zoom(1 - 1 * deltaTime)
	}
}
