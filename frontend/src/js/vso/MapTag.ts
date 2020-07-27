import TagClass from "@/js/vso/TagClass";
import Tag from "@/js/vso/Tag";
import MapDto from "data/dto/MapDto";

export default class MapTag implements Tag {
    public name: string;
    public value: string;
    public class: TagClass;

    constructor(map: MapDto) {
        this.name = map.id.toString();
        this.value = map.name
        this.class = TagClass.Map
    }
}

