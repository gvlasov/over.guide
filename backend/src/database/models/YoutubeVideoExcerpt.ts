import {AllowNull, Column, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import YoutubeVideoExcerptDto from "data/dto/YoutubeVideoExcerptDto"

@Table
export class YoutubeVideoExcerpt extends Model<YoutubeVideoExcerpt> {

    @AllowNull(false)
    @Column({type: new DataTypes.STRING(16)})
    youtubeVideoId: string

    @AllowNull(false)
    @Column({type: new DataTypes.FLOAT(8, 3)})
    startSeconds: number

    @AllowNull(false)
    @Column({type: new DataTypes.FLOAT(8, 3)})
    endSeconds: number

    @AllowNull(true)
    @Column({type: new DataTypes.FLOAT(8, 3)})
    thumbnail: number

    toDto(): YoutubeVideoExcerptDto {
        return {
            id: this.id,
            youtubeVideoId: this.youtubeVideoId,
            startSeconds: this.startSeconds,
            endSeconds: this.endSeconds,
            thumbnail: this.thumbnail,
        }
    }

    get thumbnailUrl(): string {
        return process.env.CDN_BASE_URL + '/images/custom-thumbnails/' + this.id + '.jpg'
    }

}