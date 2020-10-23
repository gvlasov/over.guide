import {CommentReadDto} from "data/dto/CommentReadDto";
import UserVso from "@/ts/vso/UserVso";
import PostVso from "@/ts/vso/PostVso";

export default class CommentVso {

    readonly id: number;
    readonly postId: number
    readonly postType: number
    readonly parentId: number|null
    content: string|null
    readonly createdAt: Date
    readonly updatedAt: Date
    votesCount: number
    readonly author: UserVso
    readonly children: CommentVso[]
    deleted: boolean

    constructor(dto: CommentReadDto, children: CommentVso[]) {
        this.id = dto.id;
        this.postId = dto.postId;
        this.postType = dto.postType;
        this.parentId = dto.parentId;
        this.content = dto.deleted ? null : dto.content;
        this.createdAt = new Date(dto.createdAt)
        this.updatedAt = new Date(dto.updatedAt)
        this.votesCount = dto.votesCount;
        this.author = new UserVso(dto.author)
        this.deleted = dto.deleted;
        this.children = children;
    }

    get recursiveChildren(): CommentVso[] {
        return this.children.flatMap(
            c => {
                if (c.children.length === 0) {
                    return [c]
                }
                return [c, ...c.recursiveChildren]
            }
        )
    }

    get strayPost(): PostVso {
        return {
            postId: this.postId,
            postType: this.postType,
            authorId: 0,
            commentsCount: 0,
        }
    }


}
