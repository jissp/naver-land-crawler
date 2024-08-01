import * as crypto from 'crypto';

export type HashDataTypes = string | { [key: string]: any } | [];

export function hash(data: HashDataTypes) {
    const targetData = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto
        .createHash('sha256')
        .update(targetData)
        .digest('hex')
        .toString();
}
