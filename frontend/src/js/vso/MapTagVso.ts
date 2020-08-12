import TagClass from "@/js/vso/TagClass";
import MapDto from "data/dto/MapDto";
import IndividualTagVso from "@/js/vso/IndividualTagVso";

export default class MapTagVso extends IndividualTagVso {
    constructor(map: MapDto) {
        super(
            map.id,
            map.dataName,
            map.name,
            TagClass.Map
        )
    }

}

