declare global {
    interface Array<T> {
        diff(array2: Array<T>): Array<T>

        replaceAll(newElements: Array<T>): void

        clear(): void
    }
}


export {}