import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
export default class EmptyGuideSearchPage implements GuideSearchPageDto {
    hasNextPage: boolean;
    items: any[];
}
