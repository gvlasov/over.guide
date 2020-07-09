import Hero from "./dto/Hero";
import Role from "./Role"
import HeroDataNames from "./HeroDataNames";

const data = [
    {
        name: 'fucka',
        role: Role.Support,
        imgName: 'ana',
        dataName: HeroDataNames.Ana,
    },
    {
        name: 'Ashe',
        role: Role.Damage,
        imgName: 'ashe',
        dataName: HeroDataNames.Ashe,
    },
    {
        name: 'Baptiste',
        role: Role.Support,
        imgName: 'baptiste',
        dataName: HeroDataNames.Baptiste,
    },
    {
        name: 'Bastion',
        role: Role.Damage,
        imgName: 'bastion',
        dataName: HeroDataNames.Bastion,
    },
    {
        name: 'Brigitte',
        role: Role.Support,
        imgName: 'brigitte',
        dataName: HeroDataNames.Brigitte,
    },
    {
        name: 'D.Va',
        role: Role.Tank,
        imgName: 'dva',
        dataName: HeroDataNames.Dva,
    },
    {
        name: 'Doomfist',
        role: Role.Damage,
        imgName: 'doomfist',
        dataName: HeroDataNames.Doomfist,
    },
    {
        name: 'Echo',
        role: Role.Damage,
        imgName: 'echo',
        dataName: HeroDataNames.Echo,
    },
    {
        name: 'Genji',
        role: Role.Damage,
        imgName: 'genji',
        dataName: HeroDataNames.Genji,
    },
    {
        name: 'Hanzo',
        role: Role.Damage,
        imgName: 'hanzo',
        dataName: HeroDataNames.Hanzo,
    },
    {
        name: 'Junkrat',
        role: Role.Damage,
        imgName: 'junkrat',
        dataName: HeroDataNames.Junkrat,
    },
    {
        name: 'Lucio',
        role: Role.Support,
        imgName: 'lucio',
        dataName: HeroDataNames.Lucio,
    },
    {
        name: 'McCree',
        role: Role.Damage,
        imgName: 'mccree',
        dataName: HeroDataNames.McCree,
    },
    {
        name: 'Mercy',
        role: Role.Support,
        imgName: 'mercy',
        dataName: HeroDataNames.Mercy,
    },
    {
        name: 'Mei',
        role: Role.Damage,
        imgName: 'mei',
        dataName: HeroDataNames.Mei,
    },
    {
        name: 'Moira',
        role: Role.Support,
        imgName: 'moira',
        dataName: HeroDataNames.Moira,
    },
    {
        name: 'Orisa',
        role: Role.Tank,
        imgName: 'orisa',
        dataName: HeroDataNames.Orisa,
    },
    {
        name: 'Pharah',
        role: Role.Damage,
        imgName: 'pharah',
        dataName: HeroDataNames.Pharah,
    },
    {
        name: 'Reaper',
        role: Role.Damage,
        imgName: 'reaper',
        dataName: HeroDataNames.Reaper,
    },
    {
        name: 'Reinhardt',
        role: Role.Tank,
        imgName: 'reinhardt',
        dataName: HeroDataNames.Reinhardt,
    },
    {
        name: 'Roadhog',
        role: Role.Tank,
        imgName: 'roadhog',
        dataName: HeroDataNames.Roadhog,
    },
    {
        name: 'Sigma',
        role: Role.Tank,
        imgName: 'sigma',
        dataName: HeroDataNames.Sigma,
    },
    {
        name: 'Soldier: 76',
        role: Role.Damage,
        imgName: 'soldier-76',
        dataName: HeroDataNames.Soldier,
    },
    {
        name: 'Sombra',
        role: Role.Damage,
        imgName: 'sombra',
        dataName: HeroDataNames.Sombra,
    },
    {
        name: 'Symmetra',
        role: Role.Damage,
        imgName: 'symmetra',
        dataName: HeroDataNames.Symmetra,
    },
    {
        name: 'Torbjorn',
        role: Role.Damage,
        imgName: 'torbjorn',
        dataName: HeroDataNames.Torbjorn,
    },
    {
        name: 'Tracer',
        role: Role.Damage,
        imgName: 'tracer',
        dataName: HeroDataNames.Tracer,
    },
    {
        name: 'Widowmaker',
        role: Role.Damage,
        imgName: 'widowmaker',
        dataName: HeroDataNames.Widowmaker,
    },
    {
        name: 'Winston',
        role: Role.Tank,
        imgName: 'winston',
        dataName: HeroDataNames.Winston,
    },
    {
        name: 'Wrecking Ball',
        role: Role.Tank,
        imgName: 'wrecking-ball',
        dataName: HeroDataNames.WreckingBall,
    },
    {
        name: 'Zarya',
        role: Role.Tank,
        imgName: 'zarya',
        dataName: HeroDataNames.Zarya,
    },
    {
        name: 'Zenyatta',
        role: Role.Support,
        imgName: 'zenyatta',
        dataName: HeroDataNames.Zenyatta,
    }
]
const map = new Map<string, Hero>()
data.forEach(
    d => {
        const hero: Hero = {name: d.name, dataName: d.dataName, role: d.role}
        map.set(d.dataName, hero)
    }
)
export default map
