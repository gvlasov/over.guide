import {CommentReadDto} from "data/dto/CommentReadDto";
import CommentVso from "@/ts/vso/CommentVso";

type CommentChildrenRegistry = {
    [key: number]: Node
}

type Node = {
    dto: CommentReadDto,
    children: CommentReadDto[],
    getParent: () => Node|null,
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
                tree[dto.parentId].children.push(dto)
            }
            tree[dto.id] = {
                dto,
                getParent: () => dto.parentId === null ? null : tree[dto.parentId],
                children: []
            }
        }
        let deletedLeaves: Node[] = []
        for (let value of Object.values(tree)) {
            if (value.children.length === 0) {
                if (value.dto.deleted) {
                    deletedLeaves.push(value)
                }
                delete tree[value.dto.id]
            }
        }
        while (deletedLeaves.length > 0) {
            const newDeletedLeaves: Node[] = []
            for (let leaf of deletedLeaves) {
                const parent = leaf.getParent();
                if (parent === null) {
                    firstLevel.splice(
                        firstLevel.findIndex(dto => dto.id === leaf.dto.id),
                        1
                    )
                } else {
                    if (parent.children.every(dto => !tree.hasOwnProperty(dto.id))) {
                        newDeletedLeaves.push(parent)
                        delete tree[leaf.dto.id]
                    }
                }
            }
            deletedLeaves = newDeletedLeaves
        }
        firstLevel.sort((a, b) => b.votes - a.votes)
        for (let node of Object.values(tree)) {
            node.children.sort((a, b) => b.votes - a.votes)
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
                const node = childrenRegistry[dto.id];
                return new CommentVso(
                    dto,
                    this.buildCommentsTree(node === void 0 ? [] : node.children, childrenRegistry)
                )
            }
        )
    }

}
