import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    BelongsToMany,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from 'sequelize-typescript';
import {Guide} from "src/database/models/Guide";
import {User} from "src/database/models/User";
import {Hero} from "src/database/models/Hero";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {DataTypes} from "sequelize";
import {GuidePartText} from "src/database/models/GuidePartText";
import {GuideHistoryEntry2GuidePartText} from "src/database/models/GuideHistoryEntry2GuidePartText";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {GuideHistoryEntry2GuidePartVideo} from "src/database/models/GuideHistoryEntry2GuidePartVideo";
import GuideHistoryEntryReadDto from "data/dto/GuideHistoryEntryReadDto";

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

    @AllowNull(false)
    @ForeignKey(() => Guide)
    @Column
    guideId: number;

    @BelongsTo(() => Guide, 'guideId')
    guide: Guide

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    updaterId: number;

    @BelongsTo(() => User, 'updaterId')
    updater: Hero

    @AllowNull(false)
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

    @AllowNull(false)
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

    toDto(): GuideHistoryEntryReadDto {
        return {
            guide: this.guide.toDto(),
            updatedAt: this.updatedOn.toISOString(),
            descriptor: this.descriptor.toDto(),
            parts: this.partsOrdered.map(part => part.toDto()),
        } as GuideHistoryEntryReadDto
    }
}
