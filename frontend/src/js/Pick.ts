import Hero from 'data/dto/Hero'
import TeamComp from "@/js/TeamComp";

export default class Pick {
    constructor(
        hero: Hero,
        allyComp: TeamComp,
        enemyComp: TeamComp,
        bans: Hero[],
        map: string
    ) {
    }
}
