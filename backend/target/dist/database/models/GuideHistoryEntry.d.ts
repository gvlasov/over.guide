import { Model } from 'sequelize-typescript';
import { Guide } from "src/database/models/Guide";
import { Hero } from "src/database/models/Hero";
import { GuideDescriptor } from "src/database/models/GuideDescriptor";
import { GuidePartText } from "src/database/models/GuidePartText";
import { GuideHistoryEntry2GuidePartText } from "src/database/models/GuideHistoryEntry2GuidePartText";
import { GuidePartVideo } from "src/database/models/GuidePartVideo";
import { GuideHistoryEntry2GuidePartVideo } from "src/database/models/GuideHistoryEntry2GuidePartVideo";
import GuideHistoryEntryReadDto from "data/dto/GuideHistoryEntryReadDto";
export declare class GuideHistoryEntry extends Model<GuideHistoryEntry> {
    id: number;
    guideId: number;
    guide: Guide;
    updaterId: number;
    updater: Hero;
    descriptorId: number;
    descriptor: GuideDescriptor;
    updatedOn: Date;
    guidePartTexts: Array<GuidePartText & {
        pivot: GuideHistoryEntry2GuidePartText;
    }>;
    guidePartVideos: Array<GuidePartVideo & {
        pivot: GuideHistoryEntry2GuidePartVideo;
    }>;
    contentHash: string;
    get partsOrdered(): (GuidePartText | GuidePartVideo)[];
    toDto(): GuideHistoryEntryReadDto;
}
