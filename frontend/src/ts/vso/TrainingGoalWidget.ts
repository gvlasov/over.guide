import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";

export default class TrainingGoalWidget {

    constructor(
        public guide: ExistingGuideHistoryEntryVso,
        public order: number,
        public deleted: boolean = true,
        public open: boolean = false
    ) {
    }

}
