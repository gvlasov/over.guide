import TagClass from "@/js/vso/TagClass";
import GuideTheme from "data/GuideTheme";
import IndividualTagVso from "@/js/vso/IndividualTagVso";

export default class ThematicTagVso extends IndividualTagVso {

    constructor(theme: GuideTheme) {
        super(
            theme.toString(),
            GuideTheme[theme],
            TagClass.Theme,
        )
    }

}

