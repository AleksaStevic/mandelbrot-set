import { Tile } from './mandelbrot'

export type WorkerTask = {
	tile: Omit<Tile, 'relOffset' | 'sides'>
}

export type WorkerResult = {
	tile: {
		image: ImageBitmap
		offset: [number, number]
		size: [number, number]
	}
	jobId: number
}
