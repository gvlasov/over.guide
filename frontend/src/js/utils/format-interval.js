/**
 * @param {number} seconds
 * @param {boolean} useHours
 * @param {boolean} useMilliseconds
 * @return {string} hh:mm:ss.SSS or mm:ss.SSS
 */
export default function formatInterval(seconds, useHours, useMilliseconds) {
    if (!useHours && seconds >= 3600) {
        throw new Error(
            "Can't use > 3600 seconds with useHours === false"
        )
    }
    var date = new Date(0);
    date.setSeconds(Math.floor(seconds));
    date.setMilliseconds(Math.round((seconds % 1.0) * 1000 % 1000));
    return date.toISOString().substr(
        useHours ? 11 : 14,
        (useMilliseconds ? 12 : 8) - (useHours ? 0 : 3)
    );
}

