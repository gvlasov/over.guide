export type YoutubeVideoExcerptThumbnailDto = YoutubeVideoExcerptDtoOriginal
    | YoutubeVideoExcerptDtoImage
    | number
export type YoutubeVideoExcerptDtoOriginal = -1.0
export type YoutubeVideoExcerptDtoImage = -2.0

export default interface YoutubeVideoExcerptDto {
    readonly youtubeVideoId: string
    startSeconds: number
    endSeconds: number | null
    thumbnail: YoutubeVideoExcerptThumbnailDto
}
