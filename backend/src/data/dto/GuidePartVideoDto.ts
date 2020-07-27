import GuidePartDto from "data/dto/GuidePartDto";
import YoutubeVideoExcerpsDto from "data/dto/YoutubeVideoExcerpsDto";

export default interface GuidePartVideoDto extends GuidePartDto {
    kind: 'video',
    excerpt: YoutubeVideoExcerpsDto;
}
