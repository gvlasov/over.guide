import { Model } from 'sequelize-typescript';
export declare class Map extends Model<Map> {
    id: number;
    name: string;
    type: number;
    dataName: string;
}
