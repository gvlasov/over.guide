import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import GuidePartTextDto from "data/dto/GuidePartTextDto";

@Table({
    name: {
        singular: 'GuidePartText',
        plural: 'GuidePartTexts',
    }
})
export class GuidePartText extends Model<GuidePartText> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @AllowNull(false)
    @Column({type: new DataTypes.TEXT})
    contentMd: string

    toDto(): GuidePartTextDto {
        return {
            contentMd: this.contentMd,
            kind: "text"
        } as GuidePartTextDto
    }

}