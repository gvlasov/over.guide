import HeroDto from 'data/dto/HeroDto'
import TeamComp from "@/ts/TeamComp";

export default class Pick {
    constructor(
        hero: HeroDto,
        teammateComp: TeamComp,
        enemyComp: TeamComp,
        bans: HeroDto[],
        map: string
    ) {
    }
}
