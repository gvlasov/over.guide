import {
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {YoutubeVideoExcerpt} from "src/database/models/YoutubeVideoExcerpt";
import GuidePartVideoDto from "data/dto/GuidePartVideoDto";

@Table({
    name: {
        singular: 'GuidePartVideo',
        plural: 'GuidePartVideos',
    }
})
export class GuidePartVideo extends Model<GuidePartVideo> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @ForeignKey(() => YoutubeVideoExcerpt)
    @Column
    excerptId: number;

    @BelongsTo(() => YoutubeVideoExcerpt)
    excerpt: YoutubeVideoExcerpt

    toDto(): GuidePartVideoDto {
        return {
            id: this.id,
            kind: 'video',
            excerpt: this.excerpt.toDto(),
        } as GuidePartVideoDto
    }

}