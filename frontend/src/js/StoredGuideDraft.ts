import GuideVso from "@/js/vso/GuideVso";


export default class StoredGuideDraft {

    get guide(): GuideVso | null {
        const item = localStorage.getItem('guide-editor-draft');
        if (item === null) {
            return null
        } else {
            return new GuideVso(JSON.parse(item))
        }
    }

    saveDraft(guide: GuideVso) {
        localStorage.setItem(
            'guide-editor-draft',
            JSON.stringify(guide.toDto())
        );
    }

    reset() {
        localStorage.removeItem(
            'guide-editor-draft'
        )
    }
}

