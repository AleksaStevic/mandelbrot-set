export const pressedKeys = new Set<string>()

export function onKeyDown(event: KeyboardEvent) {
	pressedKeys.add(event.key)
}

export function onKeyUp(event: KeyboardEvent) {
	pressedKeys.delete(event.key)
}

export function bindListeners() {
	document.addEventListener('keydown', onKeyDown)
	document.addEventListener('keyup', onKeyUp)
}
