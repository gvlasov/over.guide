import {CommentReadDto} from "data/dto/CommentReadDto";
import CommentVso from "@/ts/vso/CommentVso";

type CommentChildrenRegistry = {
    [key: number]: CommentReadDto[]
}
export default class CommentForest {

    public firstLevelComments: CommentVso[]

    constructor(private readonly dtos: CommentReadDto[]) {
        const tree: CommentChildrenRegistry = {}
        const firstLevel: CommentReadDto[] = []
        for (let dto of this.dtos) {
            if (dto.parentId === null) {
                firstLevel.push(dto)
            } else {
                if (tree[dto.parentId] === void 0) {
                    tree[dto.parentId] = []
                }
                tree[dto.parentId].push(dto)
            }
        }
        firstLevel.sort((a, b) => b.votes - a.votes)
        for (let [parentId, _] of Object.entries(tree)) {
            tree[Number.parseInt(parentId)].sort((a, b) => b.votes - a.votes)
        }
        this.firstLevelComments = this.buildCommentsTree(firstLevel, tree)
    }

    private buildCommentsTree(
        currentLevel: CommentReadDto[],
        childrenRegistry: CommentChildrenRegistry
    ): CommentVso[] {
        if (currentLevel.length === 0) {
            return []
        }
        return currentLevel.map(
            dto => {
                return new CommentVso(
                    dto,
                    this.buildCommentsTree(childrenRegistry[dto.id] || [], childrenRegistry)
                )
            }
        )
    }


}
