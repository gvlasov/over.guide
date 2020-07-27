import heroes from 'data/heroes'
import {Hero as HeroModel} from "src/database/models/Hero"
import HeroDto from "data/dto/HeroDto";

export default async () => {
    await Promise.all(
        Array.from<HeroDto>(heroes.values()).map(
            hero => {
                HeroModel.create(hero)
            }
        )
    )
}