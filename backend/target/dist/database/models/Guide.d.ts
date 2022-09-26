import { Model } from 'sequelize-typescript';
import { User } from "src/database/models/User";
import { GuideHistoryEntry } from "src/database/models/GuideHistoryEntry";
import GuideDto from "data/dto/GuideDto";
import { Vote } from "src/database/models/Vote";
import { GuideHead } from "src/database/models/GuideHead";
export declare class Guide extends Model<Guide> {
    id: number;
    authorId: number;
    author: User;
    historyEntries: Array<GuideHistoryEntry>;
    deactivatedAt: Date;
    deactivatedById: number;
    deactivatedBy: User;
    isPublic: number;
    votes: Vote[];
    head: GuideHead;
    isActive(): boolean;
    deactivate(user: User): Promise<Guide>;
    activate(user: User): Promise<Guide>;
    toDto(): GuideDto;
}
