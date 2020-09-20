import TagClass from "@/ts/vso/TagClass";
import Tag from "@/ts/vso/Tag";

export default abstract class IndividualTagVso implements Tag {

    protected constructor(
        public id: number,
        public name: string,
        public value: string,
        public cssClass: TagClass,
    ) {
    }

    get dataName() {
        return this.name;
    }
}

