import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    NotNull,
    Table
} from 'sequelize-typescript';
import {Hero} from "./Hero";
import {DataTypes} from "sequelize";
import {Patch} from "./Patch";
import {User} from "src/database/models/User";

@Table
export class MatchupEvaluation extends Model<MatchupEvaluation> {

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

    @NotNull
    @Column({allowNull: false})
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