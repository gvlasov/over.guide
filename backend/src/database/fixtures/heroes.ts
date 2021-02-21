import heroes from 'data/heroes'
import {Hero as HeroModel} from "src/database/models/Hero"
import HeroDto from "data/dto/HeroDto";

export default async () => {
    return Promise.all(
        Array.from<HeroDto>(heroes.values()).map(
            async hero => {
                return HeroModel.create(hero)
                    .then(() => {
                        console.log(hero)
                    })
            }
        )
    )
}