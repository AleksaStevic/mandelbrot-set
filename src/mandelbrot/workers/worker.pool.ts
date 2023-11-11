let id = 0
function getId() {
	return id++
}

type Job<WI, WR> = {
	task: WI
	resolve: (tile: WR) => void
	reject: (reason?: any) => void
}

export type WRData<WR> = { resultData: WR; jobId: number }
export type WIData<WI> = { task: WI; jobId: number }

export class WorkerPool<WI, WR> {
	// busy workers
	private busyWorkers = new Map<number, Worker>()
	// free workers
	private freeWorkers: { worker: Worker; id: number }[] = []
	// jobQueue
	private jobQueue: { job: Job<WI, WR>; id: number }[] = []
	// runningJobs
	private runningJobs = new Map<number, Job<WI, WR>>()

	constructor(numWorkers: number) {
		for (let i = 0; i < numWorkers; ++i) {
			const id = getId()
			const worker = new Worker(
				new URL('./draw.worker.ts', import.meta.url),
				{
					type: 'module',
				}
			)
			worker.onmessage = (e: MessageEvent<WRData<WR>>) => {
				const { jobId, resultData } = e.data
				this.onWorkerFinished(id, jobId, worker, resultData)
			}
			this.freeWorkers.push({ worker, id })
		}
	}

	exec(input: WI) {
		return new Promise<WR>((resolve, reject) => {
			const job: Job<WI, WR> = {
				task: input,
				resolve,
				reject,
			}

			const freeWorker = this.freeWorkers.pop()
			if (!freeWorker) {
				this.jobQueue.push({
					job,
					id: getId(),
				})
				return
			}

			const { worker, id } = freeWorker
			const jobId = getId()

			this.runningJobs.set(jobId, job)
			this.busyWorkers.set(id, worker)
			worker.postMessage({
				task: input,
				jobId: jobId,
			} satisfies WIData<WI>)
		})
	}

	onWorkerFinished(
		workerId: number,
		jobId: number,
		worker: Worker,
		result: WR
	) {
		this.runningJobs.get(jobId)?.resolve(result)
		this.runningJobs.delete(jobId)

		const nextJob = this.jobQueue.pop()
		if (!nextJob) {
			this.busyWorkers.delete(workerId)
			this.freeWorkers.push({ worker, id: workerId })
			return
		}

		const { job, id } = nextJob
		this.runningJobs.set(id, job)
		worker.postMessage({
			task: job.task,
			jobId: id,
		} satisfies WIData<WI>)
	}
}
