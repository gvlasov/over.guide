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
import MatchupEvaluationDto from "data/dto/MatchupEvaluationDto";
import MatchupEvaluationUserScore from "data/MatchupEvaluationUserScore";

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
    @Column({type: new DataTypes.INTEGER()})
    score: MatchupEvaluationUserScore

    @BelongsTo(() => User, 'createdById')
    createdBy: User

    @AllowNull(false)
    @Column({type: new DataTypes.STRING({length: 45})})
    ip: string

    @AllowNull(false)
    @Column({type: new DataTypes.INTEGER()})
    createdById: number

    @ForeignKey(() => Patch)
    @AllowNull(false)
    @Column
    patchId: number

    @BelongsTo(() => Patch, 'patchId')
    patch: Patch

    toDto() : MatchupEvaluationDto {
        return {
            subjectId: this.subjectId,
            objectId: this.objectId,
            score: this.score,
        }
    }

}