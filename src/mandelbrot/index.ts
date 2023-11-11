import { Canvas } from './config'
import { bindListeners } from './events'
import { assert } from './utils/helpers'
import { drawGPU } from './gpu.draw.strategy'

export function init() {
	const canvas = document.getElementById('mandelbrot-canvas')
	assert(
		canvas && canvas instanceof HTMLCanvasElement,
		'Canvas is not available.'
	)
	;[canvas.width, canvas.height] = Canvas.Size
	const gl = canvas.getContext('webgl2')
	assert(gl, () => alert('WebGL 2.0 is not available'))

	bindListeners()
	drawGPU(gl)
}
