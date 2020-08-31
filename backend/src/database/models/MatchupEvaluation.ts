import {
    AllowNull,
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    Table
} from 'sequelize-typescript';
import {Hero} from "./Hero";
import {DataTypes} from "sequelize";
import {Patch} from "./Patch";
import {User} from "src/database/models/User";

@Table
export class MatchupEvaluation extends Model<MatchupEvaluation> {

    @ForeignKey(() => Hero)
    @AllowNull(false)
    @Column
    subjectId: number;

    @BelongsTo(() => Hero, 'subjectId')
    subject: Hero

    @ForeignKey(() => Hero)
    @AllowNull(false)
    @Column
    objectId: number

    @BelongsTo(() => Hero, 'objectId')
    object: Hero

    @AllowNull(false)
    @Column
    score: number

    @BelongsTo(() => User, 'createdById')
    createdBy: User

    @AllowNull(false)
    @Column({type: new DataTypes.STRING({length: 45})})
    ip: string

    @ForeignKey(() => Patch)
    @AllowNull(false)
    @Column
    patchId: number

    @BelongsTo(() => Patch, 'patchId')
    patch: Patch

}