import assert from 'assert'
import compressInts from "../src/js/utils/integer-compression"

it('compresses consecutive integers', () => {
    assert.deepStrictEqual(
        compressInts(
            [1, 2, 3, 4, 5, 6, 7, 8]
        ),
        [1, 8]
    )
});
it('compresses several ranges of consecutive integers', () => {
    assert.deepStrictEqual(
        compressInts(
            [1, 2, 3, 4, 6, 7, 8, 9]
        ),
        [1, 4, 6, 4]
    )
});
it('doesnt compress non-consecutve integers', () => {
    assert.deepStrictEqual(
        compressInts(
            [9, 8, 7, 6, 5, 4, 3, 2, 1]
        ),
        [9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1]
    )
});
