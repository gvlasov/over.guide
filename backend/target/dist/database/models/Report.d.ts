import { Model } from 'sequelize-typescript';
import { User } from "src/database/models/User";
import PostTypeId from "data/PostTypeId";
import ReportReasonId from "data/ReportReasonId";
import ReportReadDto from "data/dto/ReportReadDto";
import { Comment } from "src/database/models/Comment";
import { GuideHead } from "src/database/models/GuideHead";
export declare class Report extends Model<Report> {
    id: number;
    private static readonly uniqueKeyName;
    postId: number;
    postTypeId: PostTypeId;
    post: Comment | GuideHead;
    comment: Comment;
    head: GuideHead;
    reporterId: number;
    reporter: User;
    reportReasonId: ReportReasonId;
    handled: number;
    static applyPosts(instances: Report | Report[]): void;
    toDto(): ReportReadDto;
}
