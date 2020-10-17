import ImmediateActionCreateDto from "data/dto/ImmediateActionCreateDto";

export default interface ImmediateActionReadDto extends ImmediateActionCreateDto {
    readonly id: number
    readonly createdAt: string
}
