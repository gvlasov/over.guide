import PostTypeId from "data/PostTypeId";
export default interface CommentCreateDto {
    readonly postId: number;
    readonly postType: PostTypeId;
    readonly parentId: number | null;
    readonly content: string;
}
