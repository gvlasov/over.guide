import TagClass from "@/js/dto/TagClass";
import GuideTheme from "data/GuideTheme";
import Tag from "@/js/dto/Tag";

export default class ThemeTag implements Tag {
    public name: string;
    public value: string;
    public class: TagClass;

    constructor(theme: GuideTheme) {
        this.name = theme.toString();
        this.value = GuideTheme[theme];
        this.class = TagClass.Theme
    }
}

