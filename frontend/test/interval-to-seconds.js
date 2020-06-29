import assert from "assert";
import intervalToSeconds from "../src/js/utils/interval-to-seconds.js";

it('parses 01:00:00.000', () => {
    assert.equal(
        intervalToSeconds("01:00:00.000", true, true),
        3600
    )
});
it('parses 00:01:00.000', () => {
    assert.equal(
        intervalToSeconds("00:01:00.000", true, true),
        60
    )
});
it('parses 00:00:01.000', () => {
    assert.equal(
        intervalToSeconds("00:00:01.000", true, true),
        1
    )
});
it('parses 00:00:01.023', () => {
    assert.equal(
        intervalToSeconds("00:00:01.023", true, true),
        1.023
    )
});
it('parses 00:00:00.001', () => {
    assert.equal(
        intervalToSeconds("00:00:00.001", true, true),
        0.001
    )
});
