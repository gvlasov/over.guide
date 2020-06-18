import assert from "assert";
import formatInterval from "../src/js/utils/format-interval";

it('formats 1 hour', () => {
    assert.equal(
        formatInterval(3600, true, true),
        "01:00:00.000"
    )
});
it('formats 1 hour 30 minutes', () => {
    assert.equal(
        formatInterval(3600 + 1800, true, true),
        "01:30:00.000"
    )
});
it('formats 10 hours', () => {
    assert.equal(
        formatInterval(36000, true, true),
        "10:00:00.000"
    )
});
it('formats 10 minutes', () => {
    assert.equal(
        formatInterval(600, true, true),
        "00:10:00.000"
    )
});
it('formats 1 minute', () => {
    assert.equal(
        formatInterval(60, true, true),
        "00:01:00.000"
    )
});
it('formats 1 minute 10 seconds', () => {
    assert.equal(
        formatInterval(60 + 10, true, true),
        "00:01:10.000"
    )
});
it('formats 1 second 23 milliseconds', () => {
    assert.equal(
        formatInterval(1.023, true, true),
        "00:00:01.023"
    )
});
it('formats 23 milliseconds', () => {
    assert.equal(
        formatInterval(0.023, true, true),
        "00:00:00.023"
    )
});
it('formats 1 hour 23 milliseconds', () => {
    assert.equal(
        formatInterval(3600.023, true, true),
        "01:00:00.023"
    )
});
it('formats 1 hour 23 milliseconds without milliseconds', () => {
    assert.equal(
        formatInterval(3600.023, true, false),
        "01:00:00"
    )
});
it('formats 30 minutes 23 milliseconds without milliseconds and hours', () => {
    assert.equal(
        formatInterval((30 * 60) + 0.023, false, false),
        "30:00"
    )
});
it('fails to format 1 hour 30 minutes 23 milliseconds without milliseconds and hours', () => {
    assert.throws(
        () => formatInterval(3600 + (30 * 60) + 0.023, false, false),
        Error,
        "Can't use > 3600 seconds with useHours === false"
    )
});
it('fails to format 1 hour 30 minutes 23 milliseconds without hours', () => {
    assert.throws(
        () => formatInterval(3600 + (30 * 60) + 0.023, false, true),
        Error,
        "Can't use > 3600 seconds with useHours === false"
    )
});
