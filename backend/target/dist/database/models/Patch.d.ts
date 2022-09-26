import { Model } from 'sequelize-typescript';
export declare class Patch extends Model<Patch> {
    id: number;
    version: string;
    date: Date;
    title: string;
}
