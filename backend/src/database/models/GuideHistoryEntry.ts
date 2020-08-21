import {
    AutoIncrement,
    BelongsTo,
    BelongsToMany,
    Column,
    ForeignKey,
    HasOne,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from 'sequelize-typescript';
import {Hero} from "src/database/models/Hero";
import {User} from "src/database/models/User";
import {Guide} from "src/database/models/Guide";
import {GuideHistoryEntry2GuidePartText} from "src/database/models/GuideHistoryEntry2GuidePartText";
import {GuidePartText} from "src/database/models/GuidePartText";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {GuideHistoryEntry2GuidePartVideo} from "src/database/models/GuideHistoryEntry2GuidePartVideo";
import {DataTypes} from "sequelize";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {GuideHead} from "src/database/models/GuideHead";
import UserDto from "data/dto/UserDto";
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";

@Table({
    name: {
        singular: 'GuideHistoryEntry',
        plural: 'GuideHistoryEntries',
    },
    createdAt: false,
})
export class GuideHistoryEntry extends Model<GuideHistoryEntry> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @ForeignKey(() => Guide)
    @Column
    guideId: number;

    @BelongsTo(() => Guide, 'guideId')
    guide: Guide

    @HasOne(() => GuideHead)
    headRecord: GuideHead | null


    @ForeignKey(() => User)
    @Column
    updaterId: number;

    @BelongsTo(() => User, 'updaterId')
    updater: Hero

    @ForeignKey(() => GuideDescriptor)
    @Column
    descriptorId: number;

    @BelongsTo(() => GuideDescriptor, 'descriptorId')
    descriptor: GuideDescriptor

    @UpdatedAt
    @Column({type: new DataTypes.DATE(6)})
    updatedOn: Date

    @BelongsToMany(
        () => GuidePartText,
        {

            through: {
                model: () => GuideHistoryEntry2GuidePartText,
            }
        }
    )
    guidePartTexts: Array<GuidePartText & { pivot: GuideHistoryEntry2GuidePartText }>

    @BelongsToMany(
        () => GuidePartVideo,
        {
            through: {
                model: () => GuideHistoryEntry2GuidePartVideo,
            }
        }
    )
    guidePartVideos: Array<GuidePartVideo & { pivot: GuideHistoryEntry2GuidePartVideo }>

    @Column({type: new DataTypes.CHAR(32)})
    contentHash: string;

    get partsOrdered(): (GuidePartText | GuidePartVideo)[] {
        return [
            ...this.guidePartTexts,
            ...this.guidePartVideos
        ].sort((a, b) => {
            let aOrder, bOrder
            if (a instanceof GuidePartText) {
                aOrder = (a as any).GuideHistoryEntry2GuidePartText.dataValues.order
            } else {
                aOrder = (a as any).GuideHistoryEntry2GuidePartVideo.dataValues.order
            }
            if (b instanceof GuidePartText) {
                bOrder = (b as any).GuideHistoryEntry2GuidePartText.dataValues.order
            } else {
                bOrder = (b as any).GuideHistoryEntry2GuidePartVideo.dataValues.order
            }
            return aOrder - bOrder;
        })
    }

    toDto(): GuideHistoryEntryDto {
        return {
            author: {
                id: this.guide.creator.id,
                name: this.guide.creator.name,
            } as UserDto,
            createdAt: this.guide.createdAt,
            descriptor: this.descriptor.toDto(),
            guideId: this.guideId,
            parts: this.partsOrdered.map(part => part.toDto()),
        } as GuideHistoryEntryDto
    }
}
