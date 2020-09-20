import AbilityDto from "data/dto/AbilityDto";
import AbilityId from "data/AbilityId";
import KeyDto from "data/dto/KeyDto";
import keys from "data/keys";
import heroes from "data/heroes";
import HeroDto from "data/dto/HeroDto";

export default class AbilityVso {

    public id: AbilityId;
    public hero: HeroDto;
    public group?: string;
    public name: string;
    public keys: KeyDto[];
    public dataName: string
    public description: string;

    constructor(dto: AbilityDto) {
        this.id = dto.id;
        this.hero = heroes.get(dto.heroId) as HeroDto;
        this.group = dto.group;
        this.name = dto.name;
        this.keys = dto.keyIds.map(keyId => keys.get(keyId) as KeyDto)
        this.dataName = dto.dataName;
        this.description = dto.description;
    }

}
