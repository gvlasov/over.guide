/**
 * Clears this array and fills it with different elements. Compatible with Vue
 * data binding.
 * @param {Array} newElements
 */
Array.prototype.replaceAll = function replaceAll(newElements) {
    console.log('replace all');
    this.clear();
    this.push(...newElements)
};
/**
 * Removes every element from this array. Compatible with Vue data binding.
 */
Array.prototype.clear = function clear() {
    console.log('clear');
    this.splice(0, this.length);
};