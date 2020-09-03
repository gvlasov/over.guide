import GuideVso from "@/js/vso/GuideVso";

export default class TrainingGoalWidget {

    constructor(
        public guide: GuideVso,
        public order: number,
        public deleted: boolean = true,
        public open: boolean = false
    ) {
    }

}
