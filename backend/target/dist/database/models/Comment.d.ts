import { Model } from 'sequelize-typescript';
import PostTypeId from "data/PostTypeId";
import { User } from "src/database/models/User";
import AliveCommentReadDto from "data/dto/AliveCommentReadDto";
import DeletedCommentReadDto from "data/dto/DeletedCommentReadDto";
import { Vote } from "src/database/models/Vote";
import { CommentReadDto } from "data/dto/CommentReadDto";
export declare class Comment extends Model<Comment> {
    id: number;
    parentId: number | null;
    parent: Comment | null;
    postId: number;
    postType: PostTypeId;
    content: string;
    authorId: number;
    author: User;
    createdAt: Date;
    updatedAt: Date;
    deactivatedAt: Date;
    deactivatedById: number;
    deactivatedBy: User;
    votes: Vote[];
    votesCount: number;
    toDto(): CommentReadDto;
    toAliveDto(): AliveCommentReadDto;
    toDeletedDto(): DeletedCommentReadDto;
}
