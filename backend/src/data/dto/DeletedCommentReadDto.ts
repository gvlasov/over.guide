import UserDto from "data/dto/UserDto";

export default interface DeletedCommentReadDto {
    readonly id: number
    readonly parentId: number | null
    readonly postId: number
    readonly postType: number
    readonly createdAt: string
    readonly updatedAt: string
    readonly votesCount: number
    readonly author: UserDto
    readonly deleted: true
}
