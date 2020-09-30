import CommentReadDto from "data/dto/CommentReadDto";
import UserVso from "@/ts/vso/UserVso";

export default class CommentVso {

    readonly id: number;
    readonly postId: number
    readonly postType: number
    readonly parentId: number|null
    readonly content: string
    readonly createdAt: Date
    readonly updatedAt: Date
    votes: number
    readonly author: UserVso
    readonly children: CommentVso[]

    constructor(dto: CommentReadDto, children: CommentVso[]) {
        this.id = dto.id;
        this.postId = dto.postId;
        this.postType = dto.postType;
        this.parentId = dto.parentId;
        this.content = dto.content;
        this.createdAt = new Date(dto.createdAt)
        this.updatedAt = new Date(dto.updatedAt)
        this.votes = dto.votes;
        this.author = new UserVso(dto.author)
        this.children = children;
    }

    get recursiveChildren(): CommentVso[] {
        const cs = this.children.flatMap(
            c => {
                if (c.children.length === 0) {
                    return []
                }
                return [...c.children, ...c.recursiveChildren]
            }
        );
        return cs
    }


}
