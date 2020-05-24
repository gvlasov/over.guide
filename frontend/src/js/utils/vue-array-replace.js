/**
 * Clears this array and fills it with different elements. Compatible with Vue
 * data binding.
 * @param {Array} newElements
 */
Array.prototype.replaceAll = function replaceAll(newElements) {
    this.clear();
    this.push(...newElements)
};
/**
 * Removes every element from this array. Compatible with Vue data binding.
 */
Array.prototype.clear = function clear() {
    this.splice(0, this.length);
};
/**
 * @param {Array} arr2
 * @returns {*[]}
 */
Array.prototype.diff = function diff(arr2) {
    return this.filter(x => !arr2.includes(x));
};
