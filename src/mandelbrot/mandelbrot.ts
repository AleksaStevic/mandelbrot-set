import { clamp, lchToRgb } from './utils/colors'
import { Mandelbrot } from './config'
import { toVectorSpace } from './coords'
import { lch, lchStyle } from './utils/helpers'
import { Vec2, add, eq, mag2, sqr } from './vec2'

const MandelbrotFillStyle = lchStyle(
	lch(Mandelbrot.MaxIterations, Mandelbrot.MaxIterations)
)

/**
 * Whether a side is in the set or not.
 *If this is true then it is in the set, if false then we need to calculate and check.
 */
export type SidesInSet = {
	top: boolean
	right: boolean
	bottom: boolean
	left: boolean
}

export type Tile = {
	/**
	 * Position of the top-left corner of the tile in the whole canvas.
	 */
	absOffset: [number, number]
	/**
	 * Position of the top-left corner of the tile in the part of canvas.
	 */
	relOffset: [number, number]
	/**
	 * Size of the current tile.
	 */
	size: [number, number]
	/**
	 * Whether we know that some side of the tile is already in mandelbrot set.
	 * This is calculated in the previous function run.
	 */
	sides: SidesInSet
}

export function drawTile(
	tile: Tile,
	tileCtx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
) {
	const { absOffset, relOffset, size, sides } = tile
	const [sx, sy] = absOffset
	const [tx, ty] = relOffset
	const [w, h] = size
	let { top, right, bottom, left } = sides

	if (!top) {
		top = true
		for (let x = sx; x < sx + w; ++x) {
			const pt = toVectorSpace([x, sy])
			if (
				calcIterations(pt, Mandelbrot.MaxIterations) !==
				Mandelbrot.MaxIterations
			) {
				top = false
				break
			}
		}
	}

	if (!right) {
		right = true
		for (let y = sy; y < sy + h; ++y) {
			const pt = toVectorSpace([sx + w, y])
			if (
				calcIterations(pt, Mandelbrot.MaxIterations) !==
				Mandelbrot.MaxIterations
			) {
				right = false
				break
			}
		}
	}

	if (!bottom) {
		bottom = true
		for (let x = sx; x < sx + w; ++x) {
			const pt = toVectorSpace([x, sy + h])
			if (
				calcIterations(pt, Mandelbrot.MaxIterations) !==
				Mandelbrot.MaxIterations
			) {
				bottom = false
				break
			}
		}
	}

	if (!left) {
		left = true
		for (let y = sy; y < sy + h; ++y) {
			const pt = toVectorSpace([sx, y])
			if (
				calcIterations(pt, Mandelbrot.MaxIterations) !==
				Mandelbrot.MaxIterations
			) {
				left = false
				break
			}
		}
	}

	if (top && right && left && bottom) {
		tileCtx.fillStyle = MandelbrotFillStyle
		tileCtx.fillRect(tx, ty, w, h)
		return
	}

	if (w <= 64 || h <= 64) {
		const imageData = tileCtx.createImageData(w, h)
		const { data } = imageData
		for (let x = sx; x < sx + w; ++x) {
			for (let y = sy; y < sy + h; ++y) {
				let numIters = calcIterations(
					toVectorSpace([x, y]),
					Mandelbrot.MaxIterations
				)
				const { r, g, b } = lchToRgb(
					lch(numIters, Mandelbrot.MaxIterations)
				)
				const k = ((y - sy) * w + (x - sx)) * 4
				;[data[k], data[k + 1], data[k + 2], data[k + 3]] = [
					clamp(r, [0, 255]),
					clamp(g, [0, 255]),
					clamp(b, [0, 255]),
					255,
				]
			}
		}

		tileCtx.putImageData(imageData, tx, ty)

		return
	}

	const [hw, hh] = [w / 2, h / 2]
	const [ow, oh] = [w - hw, h - hh]

	// top left
	drawTile(
		{
			absOffset: [sx, sy],
			relOffset: [tx, ty],
			size: [hw, hh],
			sides: { top, right: false, bottom: false, left },
		},
		tileCtx
	)
	// top right
	drawTile(
		{
			absOffset: [sx + hw, sy],
			relOffset: [tx + hw, ty],
			size: [ow, hh],
			sides: { top, right, bottom: false, left: false },
		},
		tileCtx
	)
	// bottom left
	drawTile(
		{
			absOffset: [sx, sy + hh],
			relOffset: [tx, ty + hh],
			size: [hw, oh],
			sides: { top: false, right: false, bottom, left },
		},
		tileCtx
	)
	// bottom right
	drawTile(
		{
			absOffset: [sx + hw, sy + hh],
			relOffset: [tx + hw, ty + hh],
			size: [ow, oh],
			sides: { top: false, right, bottom, left: false },
		},
		tileCtx
	)
}

// is converging: f_c(0), f_c(f_c(0)), ... , f_c(f_c( ... f_c(0) ... ))
function calcIterations(c: Vec2, n: number): number {
	let z: Vec2 = [0, 0]
	let old: Vec2 = [0, 0]
	let period = 0
	for (let i = 0; i < n; ++i) {
		// f_c(z) = z^2 + c
		z = add(sqr(z), c)

		// detecting periods, if there is a period then the point is in mandelbrot set
		if (eq(z, old)) {
			return n
		}

		if (mag2(z) > 4) {
			return i + 1
		}

		if (period > 20) {
			period = 0
			old = z
		}
	}

	return n
}
