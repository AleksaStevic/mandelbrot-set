export type Vec2 = [number, number]

export function mul(v1: Vec2, v2: Vec2 | number): Vec2 {
	if (typeof v2 === 'number') return [v1[0] * v2, v1[1] * v2]
	return [v1[0] * v2[0], v1[1] * v2[1]]
}

export function add(v1: Vec2, v2: Vec2): Vec2 {
	return [v1[0] + v2[0], v1[1] + v2[1]]
}

export function div(v1: Vec2, v2: Vec2 | number) {
	return mul(v1, typeof v2 === 'number' ? 1 / v2 : [1 / v2[0], 1 / v2[1]])
}

export function sqr(v: Vec2): Vec2 {
	return [v[0] * v[0] - v[1] * v[1], 2 * v[0] * v[1]]
}

export function eq(v1: Vec2, v2: Vec2) {
	if (v1 === v2) return true
	return v1[0] === v2[0] && v1[1] === v2[1]
}

export function mag2(v: Vec2) {
	return v[0] * v[0] + v[1] * v[1]
}
