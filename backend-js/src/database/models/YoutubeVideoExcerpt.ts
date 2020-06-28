import {Column, Model, PrimaryKey, Table, Unique} from 'sequelize-typescript';
import {DataTypes} from "sequelize";

@Table
export class YoutubeVideoExcerpt extends Model<YoutubeVideoExcerpt> {

    @PrimaryKey
    @Column
    public id: number

    @Unique
    @Column({type: new DataTypes.STRING(16)})
    youtubeVideoId: string;

    @Unique
    @Column({type: new DataTypes.FLOAT(8, 3)})
    startSeconds: number

    @Unique
    @Column({type: new DataTypes.FLOAT(8, 3)})
    endSeconds: number

}