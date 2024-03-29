import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    HasMany, HasOne,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {User} from "src/database/models/User";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {DataTypes} from "sequelize";
import {utcDate} from "@hamroctopus/utc-date";
import GuideDto from "data/dto/GuideDto";
import {Vote} from "src/database/models/Vote";
import PostTypeId from "data/PostTypeId";
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
    authorId: number

    @BelongsTo(() => User, 'authorId')
    author: User

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

    @AllowNull(false)
    @Column({type: new DataTypes.TINYINT({length: 1, unsigned: true})})
    isPublic: number

    @HasMany(
        () => Vote,
        {
            foreignKey: 'postId',
            constraints: false,
            scope: {
                'postTypeId': PostTypeId.Guide,
            },
        }
    )
    votes: Vote[]

    @HasOne(() => GuideHead, 'guideId')
    head: GuideHead

    isActive(): boolean {
        return this.deactivatedById === null && this.deactivatedAt === null
    }

    deactivate(user: User): Promise<Guide> {
        if (
            this.deactivatedById !== null
            || this.deactivatedAt !== null
        ) {
            throw new Error('Already inactive')
        }
        return this.update({
            deactivatedById: user.id,
            deactivatedAt: utcDate(),
        })
    }

    activate(user: User): Promise<Guide> {
        if (
            this.deactivatedById === null
            || this.deactivatedAt === null
        ) {
            throw new Error('Already active')
        }
        return this.update({
            deactivatedById: null,
            deactivatedAt: null,
        })
    }

    toDto(): GuideDto {
        return {
            id: this.id,
            author: this.author.toDto(),
            createdAt: this.createdAt,
            isPublic: this.isPublic === 1,
        } as GuideDto
    }

}