import A2HS from "@/ts/A2HS";

export type FeedIntrusionType = 'ad' | 'a2hs' | null

export default class FeedIntruder {

    constructor() {

    }

    intrusionForIndex(index: number): FeedIntrusionType {
        if (A2HS.instance.enabled && index === 50 || index === 100) {
            return 'a2hs'
        } else if (index > 5 && index % 4 === 0) {
            return 'ad'
        } else {
            return null
        }
    }

}
