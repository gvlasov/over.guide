import TagClass from "@/ts/vso/TagClass";
import IndividualTagVso from "@/ts/vso/IndividualTagVso";
import ThematicTagDto from "data/dto/ThematicTagDto";

export default class ThematicTagVso extends IndividualTagVso {

    constructor(thematicTag: ThematicTagDto) {
        super(
            thematicTag.id,
            thematicTag.dataName,
            thematicTag.name,
            TagClass.Theme,
        )
    }

}

