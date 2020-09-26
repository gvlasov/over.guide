import GuidePartDto from "data/dto/GuidePartDto";

export default abstract class GuidePartWidget {

    private static lastId: number = 0

    public id: number

    protected constructor(
        public part: GuidePartDto | null,
        public editing: boolean = false
    ) {
        this.id = GuidePartWidget.lastId++;
    }

    abstract get isEmpty(): boolean;

    abstract get isText(): boolean

    abstract get isVideo(): boolean

}
