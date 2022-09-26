import GuidePartDto from "data/dto/GuidePartDto";
import YoutubeVideoExcerptDto from "data/dto/YoutubeVideoExcerptDto";
export default interface GuidePartVideoDto extends GuidePartDto {
    kind: 'video';
    excerpt: YoutubeVideoExcerptDto;
}
