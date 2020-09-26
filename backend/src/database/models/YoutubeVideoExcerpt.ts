import {AllowNull, Column, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import IYoutubeVideoExcerpt from "data/dto/YoutubeVideoExcerptDto"
import YoutubeVideoExcerptDto from "data/dto/YoutubeVideoExcerptDto"

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

    toDto(): YoutubeVideoExcerptDto {
        return {
            youtubeVideoId: this.youtubeVideoId,
            startSeconds: this.startSeconds,
            endSeconds: this.endSeconds,
        } as YoutubeVideoExcerptDto
    }

}