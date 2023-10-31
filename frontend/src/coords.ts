import { add, div, mul, type Vec2 } from './vec2'
import { Canvas } from './config'

let translationVector: Vec2 = [0.11, -0.895]
let zoomFactor: Vec2 = [1700.0, 1700.0]

export function toPixelSpace(coords: Vec2): Vec2 {
	const [x, y] = coords
	const [w, h] = Canvas.Size
	const [z1, z2] = zoomFactor
	const [t1, t2] = translationVector

	return [
		(z1 * w * x + w * (z1 * t1 + 2.0)) / 4.0,
		(-z2 * h * y + h * (-z2 * t2 + 2.0)) / 4.0,
	]
}

export function toVectorSpace(coords: Vec2): Vec2 {
	const [x, y] = coords
	const [w, h] = Canvas.Size
	const [z1, z2] = zoomFactor
	const [t1, t2] = translationVector

	return [
		(4.0 * x - w * (t1 * z1 + 2.0)) / (z1 * w),
		(-4.0 * y - h * (t2 * z2 - 2.0)) / (z2 * h),
	]
}

export function translate(x: number, y: number) {
	translationVector = add(translationVector, div([x, y], zoomFactor))
}

export function zoom(v: number) {
	zoomFactor = mul(zoomFactor, v)
}
