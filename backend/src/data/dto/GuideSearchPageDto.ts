import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";

export default interface GuideSearchPageDto {
    guides: GuideHistoryEntryDto[]
    hasNextPage: boolean
    pageNumber: number
}
