import RestrictionReadDto from "data/dto/RestrictionReadDto";
import ImmediateActionReadDto from "data/dto/ImmediateActionReadDto";

export default interface SentenceReadDto {
    readonly id: number
    readonly defenderId: number
    readonly judgeId: number
    readonly restrictions: RestrictionReadDto[]
    readonly immediateActions: ImmediateActionReadDto[]
    readonly createdAt: string
    readonly updatedAt: string
    readonly judgeCommentary: string
}
