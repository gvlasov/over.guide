export declare type YoutubeVideoExcerptThumbnailDto = YoutubeVideoExcerptDtoExternal | number;
export declare enum YoutubeVideoExcerptDtoExternal {
    Original = -1,
    Image = -2
}
export default interface YoutubeVideoExcerptDto {
    id?: number;
    readonly youtubeVideoId: string;
    startSeconds: number;
    endSeconds: number | null;
    thumbnail: YoutubeVideoExcerptThumbnailDto | null;
}
