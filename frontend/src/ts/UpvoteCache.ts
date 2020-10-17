import Backend from "@/ts/Backend";
import PostTypeId from "data/PostTypeId";
import Authentication from "@/ts/Authentication";

type PostIds = {
    [key: number]: number[],
}

export default class UpvoteCache {

    private static _instance: UpvoteCache;

    public static get instance(): UpvoteCache {
        if (typeof UpvoteCache._instance === 'undefined') {
            UpvoteCache._instance = new UpvoteCache();
        }
        return UpvoteCache._instance;
    }

    private readonly postIds: PostIds

    private static readonly localStorageKeyBase = 'upvotes';

    private constructor() {
        if (Authentication.instance.userId === void 0) {
            this.postIds = {}
        } else {
            const item = localStorage.getItem(this.currentUserKey);
            if (item === null) {
                this.postIds = {}
            } else {
                this.postIds = JSON.parse(item)
            }
        }
    }

    async upvote(postTypeId: PostTypeId, postId: number): Promise<void> {
        return Backend.instance
            .upvote(postTypeId, postId)
            .then(() => {
                if (this.postIds[postTypeId] === void 0) {
                    this.postIds[postTypeId] = [];
                }
                const idsOfType = this.postIds[postTypeId];
                if (idsOfType.indexOf(postId) === -1) {
                    idsOfType.push(postId)
                    this.cacheUpvotes()
                }
            })
    }

    async removeUpvote(postTypeId: PostTypeId, postId: number): Promise<void> {
        return Backend.instance
            .removeUpvote(postTypeId, postId)
            .then(() => {
                const idsOfType = this.postIds[postTypeId];
                if (idsOfType !== void 0) {
                    const index = idsOfType.indexOf(postId);
                    if (index > -1) {
                        idsOfType.splice(index, 1)
                        this.cacheUpvotes()
                    }
                }
            })
    }

    hasUpvote(postTypeId: PostTypeId, postId: number): boolean {
        return this.postIds[postTypeId]?.includes(postId);
    }

    private cacheUpvotes() {
        localStorage.setItem(
            this.currentUserKey,
            JSON.stringify(this.postIds)
        );
    }

    get currentUserKey(): string {
        return UpvoteCache.localStorageKeyBase + '_' + Authentication.instance.userId
    }


}
