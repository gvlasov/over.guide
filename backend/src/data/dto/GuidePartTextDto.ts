import GuidePartDto from "data/dto/GuidePartDto";

export default interface GuidePartTextDto extends GuidePartDto {
    kind: 'text',
    contentMd: string
}
