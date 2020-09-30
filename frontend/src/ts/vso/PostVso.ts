import PostTypeId from "data/PostTypeId";

export default interface PostVso {
    postId: number
    postType: PostTypeId
    authorId: number
    commentsCount: number
}