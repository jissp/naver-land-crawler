export interface NumberRangeOption {
    min?: number;
    max: number;
    outOfRange?: number;
}

export function numberRange(
    value: number | undefined,
    range: NumberRangeOption,
): number {
    const isUndefinedOutOfRange = range.outOfRange === undefined;

    if (value === undefined || value < range.min) {
        return (isUndefinedOutOfRange ? range.min : range.outOfRange) ?? 0;
    }

    if (value > range.max) {
        return isUndefinedOutOfRange ? range.max : range.outOfRange;
    }

    return value;
}
