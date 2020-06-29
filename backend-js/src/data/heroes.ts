import Hero from "./dto/Hero";
import Role from "./Role"

const data = [
    {
        name: 'Ana',
        role: Role.Support,
        imgName: 'ana',
        dataName: 'ana',
    },
    {
        name: 'Ashe',
        role: Role.Damage,
        imgName: 'ashe',
        dataName: 'ashe',
    },
    {
        name: 'Baptiste',
        role: Role.Support,
        imgName: 'baptiste',
        dataName: 'baptiste',
    },
    {
        name: 'Bastion',
        role: Role.Damage,
        imgName: 'bastion',
        dataName: 'bastion',
    },
    {
        name: 'Brigitte',
        role: Role.Support,
        imgName: 'brigitte',
        dataName: 'brigitte',
    },
    {
        name: 'D.Va',
        role: Role.Tank,
        imgName: 'dva',
        dataName: 'dva',
    },
    {
        name: 'Doomfist',
        role: Role.Damage,
        imgName: 'doomfist',
        dataName: 'doomfist',
    },
    {
        name: 'Echo',
        role: Role.Damage,
        imgName: 'echo',
        dataName: 'echo',
    },
    {
        name: 'Genji',
        role: Role.Damage,
        imgName: 'genji',
        dataName: 'genji',
    },
    {
        name: 'Hanzo',
        role: Role.Damage,
        imgName: 'hanzo',
        dataName: 'hanzo',
    },
    {
        name: 'Junkrat',
        role: Role.Damage,
        imgName: 'junkrat',
        dataName: 'junkrat',
    },
    {
        name: 'Lucio',
        role: Role.Support,
        imgName: 'lucio',
        dataName: 'lucio',
    },
    {
        name: 'McCree',
        role: Role.Damage,
        imgName: 'mccree',
        dataName: 'mccree',
    },
    {
        name: 'Mercy',
        role: Role.Support,
        imgName: 'mercy',
        dataName: 'mercy',
    },
    {
        name: 'Mei',
        role: Role.Damage,
        imgName: 'mei',
        dataName: 'mei',
    },
    {
        name: 'Moira',
        role: Role.Support,
        imgName: 'moira',
        dataName: 'moira',
    },
    {
        name: 'Orisa',
        role: Role.Tank,
        imgName: 'orisa',
        dataName: 'orisa',
    },
    {
        name: 'Pharah',
        role: Role.Damage,
        imgName: 'pharah',
        dataName: 'pharah',
    },
    {
        name: 'Reaper',
        role: Role.Damage,
        imgName: 'reaper',
        dataName: 'reaper',
    },
    {
        name: 'Reinhardt',
        role: Role.Tank,
        imgName: 'reinhardt',
        dataName: 'reinhardt',
    },
    {
        name: 'Roadhog',
        role: Role.Tank,
        imgName: 'roadhog',
        dataName: 'roadhog',
    },
    {
        name: 'Sigma',
        role: Role.Tank,
        imgName: 'sigma',
        dataName: 'sigma',
    },
    {
        name: 'Soldier: 76',
        role: Role.Damage,
        imgName: 'soldier-76',
        dataName: 'soldier',
    },
    {
        name: 'Sombra',
        role: Role.Damage,
        imgName: 'sombra',
        dataName: 'sombra',
    },
    {
        name: 'Symmetra',
        role: Role.Damage,
        imgName: 'symmetra',
        dataName: 'symmetra',
    },
    {
        name: 'Torbjorn',
        role: Role.Damage,
        imgName: 'torbjorn',
        dataName: 'torbjorn',
    },
    {
        name: 'Tracer',
        role: Role.Damage,
        imgName: 'tracer',
        dataName: 'tracer',
    },
    {
        name: 'Widowmaker',
        role: Role.Damage,
        imgName: 'widowmaker',
        dataName: 'widowmaker',
    },
    {
        name: 'Winston',
        role: Role.Tank,
        imgName: 'winston',
        dataName: 'winston',
    },
    {
        name: 'Wrecking Ball',
        role: Role.Tank,
        imgName: 'wrecking-ball',
        dataName: 'wreckingball',
    },
    {
        name: 'Zarya',
        role: Role.Tank,
        imgName: 'zarya',
        dataName: 'zarya',
    },
    {
        name: 'Zenyatta',
        role: Role.Support,
        imgName: 'zenyatta',
        dataName: 'zenyatta',
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
