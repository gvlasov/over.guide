import {Column, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import IYoutubeVideoExcerpt from "data/dto/YoutubeVideoExcerpsDto"
import YoutubeVideoExcerpsDto from "data/dto/YoutubeVideoExcerpsDto"

@Table
export class YoutubeVideoExcerpt extends Model<YoutubeVideoExcerpt> implements IYoutubeVideoExcerpt {

    @Column({type: new DataTypes.STRING(16), allowNull: false})
    youtubeVideoId: string

    @Column({type: new DataTypes.FLOAT(8, 3), allowNull: false})
    startSeconds: number

    @Column({type: new DataTypes.FLOAT(8, 3), allowNull: false})
    endSeconds: number

    toDto(): YoutubeVideoExcerpsDto {
        return {
            youtubeVideoId: this.youtubeVideoId,
            startSeconds: this.startSeconds,
            endSeconds: this.endSeconds,
        } as YoutubeVideoExcerpsDto
    }

}