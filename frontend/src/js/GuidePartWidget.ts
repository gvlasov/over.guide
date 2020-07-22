import GuidePart from "data/dto/GuidePart";
import GuidePartTextWidget from "@/js/GuidePartTextWidget";
import GuidePartVideoWidget from "@/js/GuidePartVideoWidget";

export default abstract class GuidePartWidget {

    protected constructor(public part: GuidePart, public editing: boolean = false) {
    }

    abstract isText(): this is GuidePartTextWidget;

    abstract isVideo(): this is GuidePartVideoWidget;

}
