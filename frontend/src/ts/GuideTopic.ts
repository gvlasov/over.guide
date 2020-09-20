import Topic from "@/ts/Topic";

export default class GuideTopic extends Topic {

    constructor(private guideId: number) {
        super()
    }

    get id(): string {
        return 'guide' + this.guideId;
    }
}

