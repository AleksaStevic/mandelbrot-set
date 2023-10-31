import { WorkerResult, WorkerTask } from './worker.types'

let id = 0
function getId() {
	return id++
}

type Job = {
	task: WorkerTask
	resolve: (tile: WorkerResult['tile']) => void
	reject: (reason?: any) => void
}

export class WorkerPool {
	// busy workers
	private busyWorkers = new Map<number, Worker>()
	// free workers
	private freeWorkers: { worker: Worker; id: number }[] = []
	// jobQueue
	private jobQueue: { job: Job; id: number }[] = []
	// runningJobs
	private runningJobs = new Map<number, Job>()

	constructor(numWorkers: number) {
		for (let i = 0; i < numWorkers; ++i) {
			const id = getId()
			const worker = new Worker(
				new URL('./draw.worker.ts', import.meta.url),
				{
					type: 'module',
				}
			)
			worker.onmessage = (e: MessageEvent<WorkerResult>) => {
				const { jobId, tile } = e.data
				this.onWorkerFinished(id, jobId, worker, tile)
			}
			this.freeWorkers.push({ worker, id })
		}
	}

	exec(task: WorkerTask) {
		return new Promise<WorkerResult['tile']>((resolve, reject) => {
			const freeWorker = this.freeWorkers.pop()
			if (!freeWorker) {
				this.jobQueue.push({
					job: { task, resolve, reject },
					id: getId(),
				})
				return
			}

			const { worker, id } = freeWorker
			const jobId = getId()

			this.runningJobs.set(jobId, { task, resolve, reject })
			this.busyWorkers.set(id, worker)
			worker.postMessage({
				tile: task.tile,
				jobId: jobId,
			} satisfies WorkerTask & { jobId: number })
		})
	}

	onWorkerFinished(
		workerId: number,
		jobId: number,
		worker: Worker,
		tile: WorkerResult['tile']
	) {
		this.runningJobs.get(jobId)?.resolve(tile)
		this.runningJobs.delete(jobId)

		const job = this.jobQueue.pop()
		if (!job) {
			this.busyWorkers.delete(workerId)
			this.freeWorkers.push({ worker, id: workerId })
			return
		}

		const {
			job: { task, resolve, reject },
			id,
		} = job
		this.runningJobs.set(id, { task, resolve, reject })
		worker.postMessage({
			tile: task.tile,
			jobId: id,
		} satisfies WorkerTask & { jobId: number })
	}
}
