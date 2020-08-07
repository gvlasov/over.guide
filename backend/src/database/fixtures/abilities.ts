import abilities from 'data/abilities'
import {Ability as AbilityModel} from "src/database/models/Ability"
import AbilityDto from "data/dto/AbilityDto";

export default async () => {
    await Promise.all(
        Array.from<AbilityDto>(abilities.values()).map(
            a => {
                AbilityModel.create({
                    id: a.id,
                    name: a.name,
                    dataName: a.dataName,
                    heroId: a.heroId,
                })
            }
        )
    )
}