import { Canvas } from '../config'
import { WorkerPool } from './workers/worker.pool'
import { WorkerInput, WorkerOutput } from './workers/types'

type CPUDrawStrategyParams = {
	ctx: CanvasRenderingContext2D
	divisions: number
	pool: WorkerPool<WorkerInput, WorkerOutput>
}

/**
 * Draw using CPU.
 *
 * @param ctx Redering context
 */
async function drawCPU(params: CPUDrawStrategyParams) {
	const { ctx, divisions, pool } = params

	const tileWidth = Canvas.Size[0] / divisions
	const tileHeight = Canvas.Size[1] / divisions

	const promises: Promise<WorkerOutput>[] = []

	for (let i = 0; i < divisions; ++i) {
		for (let j = 0; j < divisions; ++j) {
			promises.push(
				pool.exec({
					absOffset: [i * tileWidth, j * tileHeight],
					size: [tileWidth, tileHeight],
				})
			)
		}
	}

	const results = await Promise.all(promises)
	for (const { image, offset, size } of results) {
		const [w, h] = size
		const [sx, sy] = offset
		ctx.drawImage(image, sx, sy, w, h)
	}
}

export function init(ctx: CanvasRenderingContext2D) {
	const pool = new WorkerPool<WorkerInput, WorkerOutput>(
		navigator.hardwareConcurrency
	)

	drawCPU({
		pool,
		ctx,
		divisions: 4,
	})
}
