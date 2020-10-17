import RestrictionCreateDto from "data/dto/RestrictionCreateDto";

export default interface RestrictionReadDto extends RestrictionCreateDto {
    readonly id: number
    readonly sentenceId: number
}
