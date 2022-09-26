import RestrictionCreateDto from "data/dto/RestrictionCreateDto";
import ImmediateActionCreateDto from "data/dto/ImmediateActionCreateDto";
export default interface SentenceCreateDto {
    readonly defenderId: number;
    readonly restrictions: RestrictionCreateDto[];
    readonly immediateActions: ImmediateActionCreateDto[];
    readonly judgeCommentary: string | null;
}
