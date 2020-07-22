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

}