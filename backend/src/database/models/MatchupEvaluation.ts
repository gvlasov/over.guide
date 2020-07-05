import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {Hero} from "./Hero";
import {DataTypes} from "sequelize";
import {Patch} from "./Patch";
import {User} from "src/database/models/User";

@Table
export class MatchupEvaluation extends Model<MatchupEvaluation> {

    @PrimaryKey
    @Column
    public id: number

    @ForeignKey(() => Hero)
    @Column
    subjectId: number;

    @BelongsTo(() => Hero, 'subjectId')
    subject: Hero

    @ForeignKey(() => Hero)
    @Column
    objectId: number

    @BelongsTo(() => Hero, 'objectId')
    object: Hero

    @Column
    score: number

    @BelongsTo(() => User, 'createdById')
    createdBy: User

    @Column({type: new DataTypes.STRING({length: 14})})
    ip: string

    @ForeignKey(() => Patch)
    @Column
    patchId: number

    @BelongsTo(() => Patch, 'patchId')
    patch: Patch

}