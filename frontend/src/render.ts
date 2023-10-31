import { Canvas, Mandelbrot } from './config'
import { Vec2 } from './vec2'

export function drawDot(
	center: Vec2,
	color: string,
	ctx: CanvasRenderingContext2D
) {
	const [x, y] = center
	ctx.fillStyle = color
	ctx.fillRect(Math.trunc(x), Math.trunc(y), 1, 1)
}

export function clear(ctx: CanvasRenderingContext2D) {
	const [width, height] = Canvas.Size
	ctx.fillStyle = Mandelbrot.BackgroundColor
	ctx.fillRect(0, 0, width, height)
}
