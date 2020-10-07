import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {User} from "src/database/models/User";
import PostTypeId from "data/PostTypeId";
import ReportReasonId from "data/ReportReasonId";

@Table({
    updatedAt: false,
})
export class Report extends Model<Report> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    private static readonly uniqueKeyName = 'report_unique';

    @AllowNull(false)
    @Column({
        type: new DataTypes.INTEGER(),
        unique: Report.uniqueKeyName,
    })
    postId: number

    @AllowNull(false)
    @Column({
        type: new DataTypes.INTEGER(),
        unique: Report.uniqueKeyName,
    })
    postTypeId: PostTypeId

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({
        unique: Report.uniqueKeyName,
    })
    reporterId: number

    @BelongsTo(() => User, 'reporterId')
    reporter: User

    @AllowNull(false)
    @Column({
        type: new DataTypes.INTEGER(),
    })
    reportReasonId: ReportReasonId

    @AllowNull(false)
    @Column({
        type: new DataTypes.TINYINT({unsigned: true, length: 1}),
    })
    handled: number

}