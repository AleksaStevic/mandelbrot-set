import { Canvas } from './config'
import { onKeyDown, onKeyUp } from './events'
import { benchmark } from './helpers'
import { WorkerPool } from './pool'
import { clear } from './render'
import { WorkerTask } from './worker.types'

const element = document.getElementById('mandelbrot-canvas')

if (!element || !(element instanceof HTMLCanvasElement)) {
	throw new Error('Canvas not found')
}
const pool = new WorkerPool(navigator.hardwareConcurrency)
const Divisions = 4
const tileWidth = Canvas.Size[0] / Divisions
const tileHeight = Canvas.Size[1] / Divisions

init(element)

function init(canvas: HTMLCanvasElement) {
	;[canvas.width, canvas.height] = Canvas.Size
	const ctx = canvas.getContext('2d', { alpha: false })
	if (!ctx) throw new Error('Rendering context not found')

	bindListeners()
	benchmark(() => draw(ctx), 10)

	// requestAnimationFrame(function loop() {
	// 	moveWithKeyboard()
	// 	draw(ctx)
	// 	requestAnimationFrame(loop)
	// })
}

function bindListeners() {
	document.addEventListener('keydown', onKeyDown)
	document.addEventListener('keyup', onKeyUp)
}

async function draw(ctx: CanvasRenderingContext2D) {
	clear(ctx)

	const promises: ReturnType<typeof WorkerPool.prototype.exec>[] = []

	for (let i = 0; i < Divisions; ++i) {
		for (let j = 0; j < Divisions; ++j) {
			promises.push(
				pool.exec({
					tile: {
						absOffset: [i * tileWidth, j * tileHeight],
						size: [tileWidth, tileHeight],
					},
				} satisfies WorkerTask)
			)
		}
	}

	const results = await Promise.all(promises)
	for (const { image, offset, size } of results) {
		const [w, h] = size
		const [sx, sy] = offset
		ctx.drawImage(image, sx, sy, w, h)
	}
}
