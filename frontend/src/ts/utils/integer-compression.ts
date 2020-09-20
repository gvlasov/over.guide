const flatten = require('lodash.flatten')

export default function compressInts(ints: number[]) {
    let lastStart = ints[0];
    let head = lastStart
    let ranges = [];
    for (let i = 1; i < ints.length; i++) {
        const int = ints[i]
        if (int === head + 1) {
            head = int
            continue;
        }
        ranges.push([lastStart, head - lastStart + 1])
        head = int
        lastStart = int
    }
    ranges.push([lastStart, ints[ints.length - 1] - lastStart + 1])
    return flatten(ranges)
}

