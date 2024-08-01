export async function uSleep(milliTimestamp: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliTimestamp);
    });
}
