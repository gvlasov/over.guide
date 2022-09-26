import { Model } from 'sequelize-typescript';
import Role from "data/Role";
export declare class Hero extends Model<Hero> {
    id: number;
    name: string;
    dataName: string;
    role: Role;
}
