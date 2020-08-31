import {AllowNull, Column, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import IYoutubeVideoExcerpt from "data/dto/YoutubeVideoExcerpsDto"
import YoutubeVideoExcerpsDto from "data/dto/YoutubeVideoExcerpsDto"

@Table
export class YoutubeVideoExcerpt extends Model<YoutubeVideoExcerpt> implements IYoutubeVideoExcerpt {

    @AllowNull(false)
    @Column({type: new DataTypes.STRING(16)})
    youtubeVideoId: string

    @AllowNull(false)
    @Column({type: new DataTypes.FLOAT(8, 3)})
    startSeconds: number

    @AllowNull(false)
    @Column({type: new DataTypes.FLOAT(8, 3)})
    endSeconds: number

    toDto(): YoutubeVideoExcerpsDto {
        return {
            youtubeVideoId: this.youtubeVideoId,
            startSeconds: this.startSeconds,
            endSeconds: this.endSeconds,
        } as YoutubeVideoExcerpsDto
    }

}