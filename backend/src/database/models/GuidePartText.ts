import {
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

    @Column({type: new DataTypes.TEXT})
    contentMd: string

    toDto(): GuidePartTextDto {
        return {
            contentMd: this.contentMd,
            id: this.id,
            kind: "text"
        } as GuidePartTextDto
    }

}