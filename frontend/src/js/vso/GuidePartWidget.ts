import GuidePartDto from "data/dto/GuidePartDto";

export default abstract class GuidePartWidget {

    protected constructor(public part: GuidePartDto | null, public editing: boolean = false) {
    }

    abstract get isEmpty(): boolean;

}
