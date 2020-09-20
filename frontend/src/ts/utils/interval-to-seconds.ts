function extractLeftComponent(interval: string, componentLength: number): number {
    let componentText = interval.substr(0, componentLength);
    for (let i = 0; i < componentLength - 1; i++) {
        if (componentText[0] === '0') {
            componentText = componentText.substr(1)
        } else {
            break;
        }
    }
    return Number.parseInt(componentText, 10);
}

export default function intervalToSeconds(interval: string): number {
    let hours;
    if (interval.length === 12) {
        hours = extractLeftComponent(interval, 2);
        interval = interval.substr(3);
    } else {
        hours = 0;
    }
    const minutes = extractLeftComponent(interval, 2);
    interval = interval.substr(3);
    const seconds = extractLeftComponent(interval, 2);
    interval = interval.substr(3);
    const millis = extractLeftComponent(interval, 3);
    return Number.parseFloat(
        (hours * 3600 + minutes * 60 + seconds + millis / 1000).toFixed(3)
    );
}

