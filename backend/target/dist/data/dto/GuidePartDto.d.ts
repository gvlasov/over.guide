import GuidePartName from "data/dto/GuidePartName";
import GuidePartTextDto from "data/dto/GuidePartTextDto";
import GuidePartVideoDto from "data/dto/GuidePartVideoDto";
interface GuidePartDto {
    id?: number;
    kind: GuidePartName;
}
export default GuidePartDto;
export declare type GuidePartAnyDto = GuidePartTextDto | GuidePartVideoDto;
