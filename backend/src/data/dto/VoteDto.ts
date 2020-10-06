import PostTypeId from "data/PostTypeId";

export default interface VoteDto {
    readonly postTypeId: PostTypeId
    readonly postId: number
}
