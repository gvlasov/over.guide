import { Model } from 'sequelize-typescript';
import { Patch } from "./Patch";
import { Hero } from "./Hero";
export declare class Ability extends Model<Ability> {
    id: number;
    name: string;
    dataName: string;
    heroId: number;
    hero: Hero;
    removedAtPatchId: number;
    removedAtPatch: Patch;
}
