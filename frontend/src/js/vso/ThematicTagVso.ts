import TagClass from "@/js/vso/TagClass";
import IndividualTagVso from "@/js/vso/IndividualTagVso";
import ThematicTagDto from "data/dto/ThematicTagDto";

export default class ThematicTagVso extends IndividualTagVso {

    constructor(thematicTag: ThematicTagDto) {
        super(
            thematicTag.dataName,
            thematicTag.name,
            TagClass.Theme,
        )
    }

}

