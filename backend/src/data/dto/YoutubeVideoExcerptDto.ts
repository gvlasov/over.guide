export type YoutubeVideoExcerptThumbnailDto = YoutubeVideoExcerptDtoExternal
    | number

export enum YoutubeVideoExcerptDtoExternal {
    Original = -1.0,
    Image = -2.0
}

export default interface YoutubeVideoExcerptDto {
    id?: number
    readonly youtubeVideoId: string
    startSeconds: number
    endSeconds: number | null
    thumbnail: YoutubeVideoExcerptThumbnailDto | null
}
