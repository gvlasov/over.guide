import UserDto from "data/dto/UserDto";

export default interface GuideDto {
    author: UserDto,
    id: number
    createdAt: string
    isPublic: boolean
}
