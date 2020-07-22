import TagClass from "@/js/dto/TagClass";
import Tag from "@/js/dto/Tag";
import Map from "data/Map"

export default class MapTag implements Tag {
    public name: string;
    public value: string;
    public class: TagClass;

    constructor(map: Map) {
        this.name = map.toString();
        this.value = Map[map];
        this.class = TagClass.Map
    }
}

