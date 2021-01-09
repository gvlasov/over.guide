export default interface YoutubeVideoExcerptDto {
    readonly youtubeVideoId: string
    startSeconds: number
    endSeconds: number|null
}
