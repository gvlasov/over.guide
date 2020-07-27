import GuideDescriptorDto from "data/dto/GuideDescriptorDto";

export default interface GuideSearchQueryDto extends GuideDescriptorDto {
    pageNumber: number,
    clientAlreadyHasGuideIds: number[]
}
