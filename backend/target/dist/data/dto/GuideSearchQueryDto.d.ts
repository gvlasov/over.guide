import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
export default interface GuideSearchQueryDto extends GuideDescriptorDto {
    clientAlreadyHasGuideIds: number[];
    exact: boolean;
}
