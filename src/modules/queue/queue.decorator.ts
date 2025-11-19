import { applyDecorators, SetMetadata } from '@nestjs/common';

export const QueueMetadataKey = Symbol.for('QueueMetadataKey');
export type QueueMetadataValue = {
    queueName: string[];
    workerOptions?: WorkerOptions;
};

/**
 * Bull Queue Processor 메서드에 붙이는 데코레이터입니다.
 * @param queueName
 * @param workerOptions
 * @constructor
 */
export function OnQueueProcessor(
    queueName: string | string[],
    workerOptions?: Partial<WorkerOptions>,
) {
    return applyDecorators(
        SetMetadata(QueueMetadataKey, {
            queueName: Array.isArray(queueName) ? queueName : [queueName],
            workerOptions,
        } as QueueMetadataValue),
    );
}
