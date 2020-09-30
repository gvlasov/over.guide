import UserDto from "data/dto/UserDto";

export default interface CommentReadDto {
    readonly id: number
    readonly parentId: number | null
    readonly postId: number
    readonly postType: number
    readonly content: string
    readonly createdAt: string
    readonly updatedAt: string
    readonly votes: number
    readonly author: UserDto
}
