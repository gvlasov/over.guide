import AliveCommentReadDto from "data/dto/AliveCommentReadDto";
import DeletedCommentReadDto from "data/dto/DeletedCommentReadDto";

export type CommentReadDto = AliveCommentReadDto | DeletedCommentReadDto
