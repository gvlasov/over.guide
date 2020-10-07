import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";

export default class TrainingGoalWidget {

    constructor(
        public head: ExistingGuideHeadVso,
        public order: number,
        public deleted: boolean = true,
        public open: boolean = false
    ) {
    }

}
