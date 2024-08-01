/**
 * 스케줄링의 동시성을 1개로 제한하는 데코레이터.
 * @constructor
 */
export function RunOnce(): MethodDecorator {
    let isRun = false;

    return (target, propertyKey, descriptor: PropertyDescriptor) => {
        const originalFunc = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            if (isRun) {
                return;
            }

            isRun = true;

            return Promise.resolve(originalFunc.apply(this, args)).finally(
                () => {
                    isRun = false;
                },
            );
        };

        return descriptor;
    };
}
