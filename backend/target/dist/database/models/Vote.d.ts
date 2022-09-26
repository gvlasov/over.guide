import { Model } from 'sequelize-typescript';
import { User } from "src/database/models/User";
import PostTypeId from "data/PostTypeId";
export declare class Vote extends Model<Vote> {
    id: number;
    private static readonly uniqueKeyName;
    postId: number;
    postTypeId: PostTypeId;
    upvoterId: number;
    upvoter: User;
}
