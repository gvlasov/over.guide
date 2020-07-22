import MapType from "data/MapType";

export default interface Map {
    readonly id: number;
    readonly name: string;
    readonly dataName: string
    readonly type: MapType;
}
