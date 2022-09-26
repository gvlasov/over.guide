import { Model } from 'sequelize-typescript';
import { Hero } from "src/database/models/Hero";
import { Map } from "src/database/models/Map";
import { ThematicTag } from "src/database/models/ThematicTag";
import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import { Ability } from "src/database/models/Ability";
export declare class GuideDescriptor extends Model<GuideDescriptor> {
    id: number;
    players: Hero[];
    playerAbilities: Ability[];
    teammates: Hero[];
    teammateAbilities: Ability[];
    enemies: Hero[];
    enemyAbilities: Ability[];
    maps: Map[];
    thematicTags: ThematicTag[];
    contentHash: string;
    toDto(): GuideDescriptorDto;
}
