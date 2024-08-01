import { JobOptions, Queue } from 'bull';
import { hash } from '@modules/utils/hash';

export type QueueOptions = {
    isUniq?: boolean;
};

export abstract class AbstractQueueService {
    protected queueMap: { [key in string]?: Queue } = {};

    /**
     * QueueMap에서 Queue를 반환한다.
     * @param queueType
     * @protected
     */
    protected getQueue(queueType: string) {
        if (this.queueMap[queueType]) {
            return this.queueMap[queueType];
        }

        return null;
    }

    /**
     * Queue에 Job을 추가한다.
     * @param queueType
     * @param data
     * @param options
     */
    protected async _addJob<T = any>({
        queueType,
        data,
        options,
    }: {
        queueType: string;
        data: T;
        options?: QueueOptions;
    }) {
        const queue = this.getQueue(queueType);
        if (!queue) {
            throw new Error('Unknown Queue');
        }

        const jobOptions: JobOptions = {
            removeOnComplete: true,
            removeOnFail: true,
        };

        if (options?.isUniq) {
            const currentJobs = await queue.getJobs(['waiting']);

            if (currentJobs.length) {
                const jobId = hash(data);

                const findJob = currentJobs.find((job) => job.id === jobId);
                if (findJob) {
                    return null;
                }

                jobOptions.jobId = jobId;
            }
        }

        return queue.add(data, jobOptions);
    }
}
