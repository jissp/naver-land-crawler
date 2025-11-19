/**
 * 스케줄링의 동시성을 1개로 제한하는 데코레이터.
 * @constructor
 */
export function PreventConcurrentExecution(): MethodDecorator {
    let isExecuting = false;

    return (target, propertyKey, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            if (isExecuting) {
                return;
            }

            isExecuting = true;

            try {
                return Promise.resolve(originalMethod.apply(this, args));
            } finally {
                isExecuting = false;
            }
        };

        return descriptor;
    };
}
