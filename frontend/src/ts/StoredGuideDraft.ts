import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";
import NewGuideHistoryEntryVso from "@/ts/vso/NewGuideHistoryEntryVso";


export default class StoredGuideDraft {

    private static readonly storageKey = 'guide-editor-draft';

    get guide(): GuideHistoryEntryCreateDto | null {
        const item = localStorage.getItem(StoredGuideDraft.storageKey);
        if (item === null) {
            return null
        } else {
            return JSON.parse(item)
        }
    }

    saveDraft(guide: NewGuideHistoryEntryVso) {
        localStorage.setItem(
            StoredGuideDraft.storageKey,
            JSON.stringify(guide.toDto())
        );
    }

    reset() {
        localStorage.removeItem(
            StoredGuideDraft.storageKey
        )
    }
}

