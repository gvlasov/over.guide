import {ExistingGuideHeadDto} from "data/dto/GuideHeadDto";

export default interface GuideSearchPageDto {
    guides: ExistingGuideHeadDto[]
    hasNextPage: boolean
    pageNumber: number
}
