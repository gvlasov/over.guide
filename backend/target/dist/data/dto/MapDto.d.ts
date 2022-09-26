import MapType from "data/MapType";
import MapName from "data/MapName";
import MapId from "data/MapId";
export default interface MapDto {
    readonly id: MapId;
    readonly name: MapName;
    readonly dataName: string;
    readonly type: MapType;
}
