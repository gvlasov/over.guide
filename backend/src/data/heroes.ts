import Hero from "data/dto/Hero";
import Role from "data/Role"
import HeroDataNames from "data/HeroDataNames";
import HeroIds from "data/HeroIds";

const data = [
    {
        name: 'Ana',
        id: HeroIds.Ana,
        role: Role.Support,
        imgName: 'ana',
        dataName: HeroDataNames.Ana,
    },
    {
        name: 'Ashe',
        id: HeroIds.Ashe,
        role: Role.Damage,
        imgName: 'ashe',
        dataName: HeroDataNames.Ashe,
    },
    {
        name: 'Baptiste',
        id: HeroIds.Baptiste,
        role: Role.Support,
        imgName: 'baptiste',
        dataName: HeroDataNames.Baptiste,
    },
    {
        name: 'Bastion',
        id: HeroIds.Bastion,
        role: Role.Damage,
        imgName: 'bastion',
        dataName: HeroDataNames.Bastion,
    },
    {
        name: 'Brigitte',
        id: HeroIds.Brigitte,
        role: Role.Support,
        imgName: 'brigitte',
        dataName: HeroDataNames.Brigitte,
    },
    {
        name: 'D.Va',
        id: HeroIds.Dva,
        role: Role.Tank,
        imgName: 'dva',
        dataName: HeroDataNames.Dva,
    },
    {
        name: 'Doomfist',
        id: HeroIds.Doomfist,
        role: Role.Damage,
        imgName: 'doomfist',
        dataName: HeroDataNames.Doomfist,
    },
    {
        name: 'Echo',
        id: HeroIds.Echo,
        role: Role.Damage,
        imgName: 'echo',
        dataName: HeroDataNames.Echo,
    },
    {
        name: 'Genji',
        id: HeroIds.Genji,
        role: Role.Damage,
        imgName: 'genji',
        dataName: HeroDataNames.Genji,
    },
    {
        name: 'Hanzo',
        id: HeroIds.Hanzo,
        role: Role.Damage,
        imgName: 'hanzo',
        dataName: HeroDataNames.Hanzo,
    },
    {
        name: 'Junkrat',
        id: HeroIds.Junkrat,
        role: Role.Damage,
        imgName: 'junkrat',
        dataName: HeroDataNames.Junkrat,
    },
    {
        name: 'Lucio',
        id: HeroIds.Lucio,
        role: Role.Support,
        imgName: 'lucio',
        dataName: HeroDataNames.Lucio,
    },
    {
        name: 'McCree',
        id: HeroIds.McCree,
        role: Role.Damage,
        imgName: 'mccree',
        dataName: HeroDataNames.McCree,
    },
    {
        name: 'Mercy',
        id: HeroIds.Mercy,
        role: Role.Support,
        imgName: 'mercy',
        dataName: HeroDataNames.Mercy,
    },
    {
        name: 'Mei',
        id: HeroIds.Mei,
        role: Role.Damage,
        imgName: 'mei',
        dataName: HeroDataNames.Mei,
    },
    {
        name: 'Moira',
        id: HeroIds.Moira,
        role: Role.Support,
        imgName: 'moira',
        dataName: HeroDataNames.Moira,
    },
    {
        name: 'Orisa',
        id: HeroIds.Orisa,
        role: Role.Tank,
        imgName: 'orisa',
        dataName: HeroDataNames.Orisa,
    },
    {
        name: 'Pharah',
        id: HeroIds.Pharah,
        role: Role.Damage,
        imgName: 'pharah',
        dataName: HeroDataNames.Pharah,
    },
    {
        name: 'Reaper',
        id: HeroIds.Reaper,
        role: Role.Damage,
        imgName: 'reaper',
        dataName: HeroDataNames.Reaper,
    },
    {
        name: 'Reinhardt',
        id: HeroIds.Reinhardt,
        role: Role.Tank,
        imgName: 'reinhardt',
        dataName: HeroDataNames.Reinhardt,
    },
    {
        name: 'Roadhog',
        id: HeroIds.Roadhog,
        role: Role.Tank,
        imgName: 'roadhog',
        dataName: HeroDataNames.Roadhog,
    },
    {
        name: 'Sigma',
        id: HeroIds.Sigma,
        role: Role.Tank,
        imgName: 'sigma',
        dataName: HeroDataNames.Sigma,
    },
    {
        name: 'Soldier: 76',
        id: HeroIds.Soldier,
        role: Role.Damage,
        imgName: 'soldier-76',
        dataName: HeroDataNames.Soldier,
    },
    {
        name: 'Sombra',
        id: HeroIds.Sombra,
        role: Role.Damage,
        imgName: 'sombra',
        dataName: HeroDataNames.Sombra,
    },
    {
        name: 'Symmetra',
        id: HeroIds.Symmetra,
        role: Role.Damage,
        imgName: 'symmetra',
        dataName: HeroDataNames.Symmetra,
    },
    {
        name: 'Torbjorn',
        id: HeroIds.Torbjorn,
        role: Role.Damage,
        imgName: 'torbjorn',
        dataName: HeroDataNames.Torbjorn,
    },
    {
        name: 'Tracer',
        id: HeroIds.Tracer,
        role: Role.Damage,
        imgName: 'tracer',
        dataName: HeroDataNames.Tracer,
    },
    {
        name: 'Widowmaker',
        id: HeroIds.Widowmaker,
        role: Role.Damage,
        imgName: 'widowmaker',
        dataName: HeroDataNames.Widowmaker,
    },
    {
        name: 'Winston',
        id: HeroIds.Winston,
        role: Role.Tank,
        imgName: 'winston',
        dataName: HeroDataNames.Winston,
    },
    {
        name: 'Wrecking Ball',
        id: HeroIds.WreckingBall,
        role: Role.Tank,
        imgName: 'wrecking-ball',
        dataName: HeroDataNames.WreckingBall,
    },
    {
        name: 'Zarya',
        id: HeroIds.Zarya,
        role: Role.Tank,
        imgName: 'zarya',
        dataName: HeroDataNames.Zarya,
    },
    {
        name: 'Zenyatta',
        id: HeroIds.Zenyatta,
        role: Role.Support,
        imgName: 'zenyatta',
        dataName: HeroDataNames.Zenyatta,
    }
]
const map = new Map<string, Hero>()
data.forEach(
    d => {
        const hero: Hero = {
            name: d.name,
            dataName: d.dataName,
            role: d.role,
            id: d.id
        }
        map.set(d.dataName, hero)
    }
)
export default map
