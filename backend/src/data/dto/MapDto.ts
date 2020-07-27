import MapType from "data/MapType";
import MapName from "data/MapName";

export default interface MapDto {
    readonly id: number;
    readonly name: MapName;
    readonly dataName: string
    readonly type: MapType;
}
