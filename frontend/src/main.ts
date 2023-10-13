import { draw, getCanvasSize } from 'wasm'
import { onKeyDown, moveWithKeyboard, onKeyUp } from './events'

const element = document.getElementById('mandelbrot-canvas')

if (!element || !(element instanceof HTMLCanvasElement)) {
	throw new Error('Canvas not found')
}

init(element)

function init(canvas: HTMLCanvasElement) {
	const size = getCanvasSize()
	canvas.width = size[0]
	canvas.height = size[1]
	const ctx = canvas.getContext('2d', { alpha: false })
	if (!ctx) throw new Error('Rendering context not found')

	bindListeners()

	requestAnimationFrame(function loop() {
		moveWithKeyboard()
		draw(ctx)
		requestAnimationFrame(loop)
	})
}

function bindListeners() {
	document.addEventListener('keydown', onKeyDown)
	document.addEventListener('keyup', onKeyUp)
}
