import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    BelongsToMany,
    Column,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {User} from "src/database/models/User";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {DataTypes} from "sequelize";
import {utcDate} from "@hamroctopus/utc-date";
import {GuideHead} from "src/database/models/GuideHead";

@Table({
    name: {
        singular: 'Guide',
        plural: 'Guides',
    },
    updatedAt: false,
})
export class Guide extends Model<Guide> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    creatorId: number

    @BelongsTo(() => User, 'creatorId')
    creator: User

    @HasMany(() => GuideHistoryEntry)
    historyEntries: Array<GuideHistoryEntry>

    @AllowNull(true)
    @Column({type: new DataTypes.DATE()})
    deactivatedAt: Date

    @AllowNull(true)
    @ForeignKey(() => User)
    @Column
    deactivatedById: number

    @BelongsTo(() => User, 'deactivatedById')
    deactivatedBy: User

    isActive(): boolean {
        return this.deactivatedById === null && this.deactivatedAt === null
    }

    @BelongsToMany(() => GuideHistoryEntry, () => GuideHead)
    heads: Array<GuideHistoryEntry>

    get head(): GuideHistoryEntry {
        return this.heads[0]
    }

    deactivate(user: User): Promise<Guide> {
        if (this.deactivatedById !== null) {
            throw new Error('Already inactive')
        }
        if (this.deactivatedAt !== null) {
            throw new Error('Already inactive')
        }
        return this.update({
            deactivatedById: user.id,
            deactivatedAt: utcDate(),
        })
    }

    activate(user: User): Promise<Guide> {
        if (this.deactivatedById === null) {
            throw new Error('Already active')
        }
        if (this.deactivatedAt === null) {
            throw new Error('Already active')
        }
        return this.update({
            deactivatedById: null,
            deactivatedAt: null,
        })
    }

}