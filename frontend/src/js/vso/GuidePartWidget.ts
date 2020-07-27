import GuidePartDto from "data/dto/GuidePartDto";
import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";
import GuidePartVideoWidget from "@/js/vso/GuidePartVideoWidget";

export default abstract class GuidePartWidget {

    protected constructor(public part: GuidePartDto, public editing: boolean = false) {
    }

    abstract isText(): this is GuidePartTextWidget;

    abstract isVideo(): this is GuidePartVideoWidget;

}
