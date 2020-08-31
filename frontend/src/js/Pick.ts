import HeroDto from 'data/dto/HeroDto'
import TeamComp from "@/js/TeamComp";

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
