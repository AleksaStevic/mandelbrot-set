import { drawTile } from './mandelbrot'
import { type WorkerTask, type WorkerResult } from './worker.types'

onmessage = (e: MessageEvent<WorkerTask & { jobId: number }>) => {
	const { data } = e
	const { tile, jobId } = data
	const { size, absOffset } = tile
	const [w, h] = size
	const canvas = new OffscreenCanvas(w, h)
	const ctx = canvas.getContext('2d')

	if (!ctx) {
		throw new Error('Rendering context does not exist.')
	}

	drawTile(
		{
			absOffset,
			relOffset: [0, 0],
			size,
			sides: { top: false, right: false, bottom: false, left: false },
		},
		ctx
	)

	postMessage({
		tile: {
			image: canvas.transferToImageBitmap(),
			offset: absOffset,
			size,
		},
		jobId,
	} satisfies WorkerResult)
}
