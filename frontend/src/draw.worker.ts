import { drawTile } from './mandelbrot'
import { WIData, WRData } from './pool'
import { type WorkerInput, type WorkerOutput } from './worker.types'

onmessage = (e: MessageEvent<WIData<WorkerInput>>) => {
	const { data } = e
	const { task, jobId } = data
	const { size, absOffset } = task
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
		resultData: {
			image: canvas.transferToImageBitmap(),
			offset: absOffset,
			size,
		},
		jobId,
	} satisfies WRData<WorkerOutput>)
}
