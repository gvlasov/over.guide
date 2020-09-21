import UserDto from "data/dto/UserDto";

export default interface CommentDto {
    readonly id: number;
    readonly parentId: number
    readonly parentType: number
    readonly content: string
    readonly createdAt: string
    readonly updatedAt: string
    readonly votes: number
    readonly createdBy: UserDto
}
