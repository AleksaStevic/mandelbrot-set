import { translate, zoom } from './coords'

export const pressedKeys = new Set<string>()

export function onKeyDown(event: KeyboardEvent) {
	pressedKeys.add(event.key)
}

export function onKeyUp(event: KeyboardEvent) {
	pressedKeys.delete(event.key)
}

export function moveWithKeyboard() {
	if (pressedKeys.has('a')) {
		translate(0.1, 0)
	}

	if (pressedKeys.has('d')) {
		translate(-0.1, 0)
	}

	if (pressedKeys.has('w')) {
		translate(0, -0.1)
	}

	if (pressedKeys.has('s')) {
		translate(0, 0.1)
	}

	// ZOOM:
	if (pressedKeys.has('q')) {
		zoom(1.05)
	}

	if (pressedKeys.has('e')) {
		zoom(0.95)
	}
}
