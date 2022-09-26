import SentenceCreateDto from "data/dto/SentenceCreateDto";
export default interface SentenceUpdateDto extends SentenceCreateDto {
    readonly id: number;
}
