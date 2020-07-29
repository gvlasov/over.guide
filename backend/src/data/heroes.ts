import HeroDto from "data/dto/HeroDto";
import Role from "data/Role"
import HeroDataNames from "data/HeroDataNames";
import HeroId from "data/HeroId";

const data = [
    {
        name: 'Ana',
        id: HeroId.Ana,
        role: Role.Support,
        imgName: 'ana',
        dataName: HeroDataNames.Ana,
    },
    {
        name: 'Ashe',
        id: HeroId.Ashe,
        role: Role.Damage,
        imgName: 'ashe',
        dataName: HeroDataNames.Ashe,
    },
    {
        name: 'Baptiste',
        id: HeroId.Baptiste,
        role: Role.Support,
        imgName: 'baptiste',
        dataName: HeroDataNames.Baptiste,
    },
    {
        name: 'Bastion',
        id: HeroId.Bastion,
        role: Role.Damage,
        imgName: 'bastion',
        dataName: HeroDataNames.Bastion,
    },
    {
        name: 'Brigitte',
        id: HeroId.Brigitte,
        role: Role.Support,
        imgName: 'brigitte',
        dataName: HeroDataNames.Brigitte,
    },
    {
        name: 'D.Va',
        id: HeroId.Dva,
        role: Role.Tank,
        imgName: 'dva',
        dataName: HeroDataNames.Dva,
    },
    {
        name: 'Doomfist',
        id: HeroId.Doomfist,
        role: Role.Damage,
        imgName: 'doomfist',
        dataName: HeroDataNames.Doomfist,
    },
    {
        name: 'Echo',
        id: HeroId.Echo,
        role: Role.Damage,
        imgName: 'echo',
        dataName: HeroDataNames.Echo,
    },
    {
        name: 'Genji',
        id: HeroId.Genji,
        role: Role.Damage,
        imgName: 'genji',
        dataName: HeroDataNames.Genji,
    },
    {
        name: 'Hanzo',
        id: HeroId.Hanzo,
        role: Role.Damage,
        imgName: 'hanzo',
        dataName: HeroDataNames.Hanzo,
    },
    {
        name: 'Junkrat',
        id: HeroId.Junkrat,
        role: Role.Damage,
        imgName: 'junkrat',
        dataName: HeroDataNames.Junkrat,
    },
    {
        name: 'Lucio',
        id: HeroId.Lucio,
        role: Role.Support,
        imgName: 'lucio',
        dataName: HeroDataNames.Lucio,
    },
    {
        name: 'McCree',
        id: HeroId.McCree,
        role: Role.Damage,
        imgName: 'mccree',
        dataName: HeroDataNames.McCree,
    },
    {
        name: 'Mercy',
        id: HeroId.Mercy,
        role: Role.Support,
        imgName: 'mercy',
        dataName: HeroDataNames.Mercy,
    },
    {
        name: 'Mei',
        id: HeroId.Mei,
        role: Role.Damage,
        imgName: 'mei',
        dataName: HeroDataNames.Mei,
    },
    {
        name: 'Moira',
        id: HeroId.Moira,
        role: Role.Support,
        imgName: 'moira',
        dataName: HeroDataNames.Moira,
    },
    {
        name: 'Orisa',
        id: HeroId.Orisa,
        role: Role.Tank,
        imgName: 'orisa',
        dataName: HeroDataNames.Orisa,
    },
    {
        name: 'Pharah',
        id: HeroId.Pharah,
        role: Role.Damage,
        imgName: 'pharah',
        dataName: HeroDataNames.Pharah,
    },
    {
        name: 'Reaper',
        id: HeroId.Reaper,
        role: Role.Damage,
        imgName: 'reaper',
        dataName: HeroDataNames.Reaper,
    },
    {
        name: 'Reinhardt',
        id: HeroId.Reinhardt,
        role: Role.Tank,
        imgName: 'reinhardt',
        dataName: HeroDataNames.Reinhardt,
    },
    {
        name: 'Roadhog',
        id: HeroId.Roadhog,
        role: Role.Tank,
        imgName: 'roadhog',
        dataName: HeroDataNames.Roadhog,
    },
    {
        name: 'Sigma',
        id: HeroId.Sigma,
        role: Role.Tank,
        imgName: 'sigma',
        dataName: HeroDataNames.Sigma,
    },
    {
        name: 'Soldier: 76',
        id: HeroId.Soldier,
        role: Role.Damage,
        imgName: 'soldier-76',
        dataName: HeroDataNames.Soldier,
    },
    {
        name: 'Sombra',
        id: HeroId.Sombra,
        role: Role.Damage,
        imgName: 'sombra',
        dataName: HeroDataNames.Sombra,
    },
    {
        name: 'Symmetra',
        id: HeroId.Symmetra,
        role: Role.Damage,
        imgName: 'symmetra',
        dataName: HeroDataNames.Symmetra,
    },
    {
        name: 'Torbjorn',
        id: HeroId.Torbjorn,
        role: Role.Damage,
        imgName: 'torbjorn',
        dataName: HeroDataNames.Torbjorn,
    },
    {
        name: 'Tracer',
        id: HeroId.Tracer,
        role: Role.Damage,
        imgName: 'tracer',
        dataName: HeroDataNames.Tracer,
    },
    {
        name: 'Widowmaker',
        id: HeroId.Widowmaker,
        role: Role.Damage,
        imgName: 'widowmaker',
        dataName: HeroDataNames.Widowmaker,
    },
    {
        name: 'Winston',
        id: HeroId.Winston,
        role: Role.Tank,
        imgName: 'winston',
        dataName: HeroDataNames.Winston,
    },
    {
        name: 'Wrecking Ball',
        id: HeroId.WreckingBall,
        role: Role.Tank,
        imgName: 'wrecking-ball',
        dataName: HeroDataNames.WreckingBall,
    },
    {
        name: 'Zarya',
        id: HeroId.Zarya,
        role: Role.Tank,
        imgName: 'zarya',
        dataName: HeroDataNames.Zarya,
    },
    {
        name: 'Zenyatta',
        id: HeroId.Zenyatta,
        role: Role.Support,
        imgName: 'zenyatta',
        dataName: HeroDataNames.Zenyatta,
    }
]
const map = new Map<HeroId, HeroDto>()
data.forEach(
    d => {
        const hero: HeroDto = {
            name: d.name,
            dataName: d.dataName,
            role: d.role,
            id: d.id
        }
        map.set(d.id, hero)
    }
)
export default map
