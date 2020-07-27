import assert from 'assert'
import intervalToSeconds from "../src/js/utils/interval-to-seconds"

it('parses 01:00:00.000', () => {
    assert.strictEqual(
        intervalToSeconds("01:00:00.000"),
        3600
    )
});
it('parses 00:01:00.000', () => {
    assert.strictEqual(
        intervalToSeconds("00:01:00.000"),
        60
    )
});
it('parses 00:00:01.000', () => {
    assert.strictEqual(
        intervalToSeconds("00:00:01.000"),
        1
    )
});
it('parses 00:00:01.023', () => {
    assert.strictEqual(
        intervalToSeconds("00:00:01.023"),
        1.023
    )
});
it('parses 00:00:00.001', () => {
    assert.strictEqual(
        intervalToSeconds("00:00:00.001"),
        0.001
    )
});
