export type WorkerInput = {
	absOffset: [number, number]
	size: [number, number]
}

export type WorkerOutput = {
	image: ImageBitmap
	offset: [number, number]
	size: [number, number]
}
