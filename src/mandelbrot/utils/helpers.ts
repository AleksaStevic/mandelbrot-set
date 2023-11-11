import { LCHColor } from './colors'

export async function benchmark(func: () => any, iterations: number) {
	const start = performance.now()
	for (let i = 0; i < iterations; ++i) await func()
	console.log(
		`Finished. Avg run time: ${(performance.now() - start) / iterations}ms`
	)
}

export function lch(n: number, max: number): LCHColor {
	let x = 0.75
	let s = Math.pow(n / max, x)
	let v = 1.0 - Math.cos(Math.PI * s) * Math.cos(Math.PI * s)
	let l = 75.0 * (1.0 - v)
	let c = 28.0 + l
	let h = Math.pow(360.0 * s, 1.5) % 360.0

	return { l, c, h }
}

export function lchStyle(c: LCHColor) {
	return `lch(${c.l}%, ${c.c}, ${c.h})`
}

export function assert(
	value: any,
	message: string | ((value: any) => void)
): asserts value {
	if (!value) {
		if (typeof message === 'string') throw new Error(message)
		else message(value)
	}
}
