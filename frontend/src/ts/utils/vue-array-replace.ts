declare global {
    interface Array<T> {
        diff(array2: Array<T>): Array<T>

        replaceAll(newElements: Array<T>): void

        clear(): void
    }
}

/**
 * Clears this array and fills it with different elements. Compatible with Vue
 * data binding.
 */
Object.defineProperty(Array.prototype, 'replaceAll', {
    value: function replaceAll<T>(newElements: T[]): void {
        this.clear();
        this.push(...newElements)
    }
})
/**
 * Removes every element from this array. Compatible with Vue data binding.
 */
Array.prototype.clear = function clear(): void {
    this.splice(0, this.length);
};
Array.prototype.diff = function diff<T>(arr2: T[]): T[] {
    return this.filter(x => !arr2.includes(x));
};
export {}
