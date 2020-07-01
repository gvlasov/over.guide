import {Column, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import IYoutubeVideoExcerpt from "src/data/dto/YoutubeVideoExcerpt"

@Table
export class YoutubeVideoExcerpt extends Model<YoutubeVideoExcerpt> implements IYoutubeVideoExcerpt {

    @Column({type: new DataTypes.STRING(16), allowNull: false})
    youtubeVideoId: string

    @Column({type: new DataTypes.FLOAT(8, 3), allowNull: false})
    startSeconds: number

    @Column({type: new DataTypes.FLOAT(8, 3), allowNull: false})
    endSeconds: number

}