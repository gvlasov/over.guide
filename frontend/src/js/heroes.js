import Hero from "../js/Hero.js";

export default [
    {
        name: 'Ana',
        role: 'Support',
        imgName: 'ana',
        dataName: 'ana',
    },
    {
        name: 'Ashe',
        role: 'Damage',
        imgName: 'ashe',
        dataName: 'ashe',
    },
    {
        name: 'Baptiste',
        role: 'Support',
        imgName: 'baptiste',
        dataName: 'baptiste',
    },
    {
        name: 'Bastion',
        role: 'Damage',
        imgName: 'bastion',
        dataName: 'bastion',
    },
    {
        name: 'Brigitte',
        role: 'Support',
        imgName: 'brigitte',
        dataName: 'brigitte',
    },
    {
        name: 'D.Va',
        role: 'Tank',
        imgName: 'dva',
        dataName: 'dva',
    },
    {
        name: 'Doomfist',
        role: 'Damage',
        imgName: 'doomfist',
        dataName: 'doomfist',
    },
    {
        name: 'Echo',
        role: 'Damage',
        imgName: 'echo',
        dataName: 'echo',
    },
    {
        name: 'Genji',
        role: 'Damage',
        imgName: 'genji',
        dataName: 'genji',
    },
    {
        name: 'Hanzo',
        role: 'Damage',
        imgName: 'hanzo',
        dataName: 'hanzo',
    },
    {
        name: 'Junkrat',
        role: 'Damage',
        imgName: 'junkrat',
        dataName: 'junkrat',
    },
    {
        name: 'Lucio',
        role: 'Support',
        imgName: 'lucio',
        dataName: 'lucio',
    },
    {
        name: 'McCree',
        role: 'Damage',
        imgName: 'mccree',
        dataName: 'mccree',
    },
    {
        name: 'Mercy',
        role: 'Support',
        imgName: 'mercy',
        dataName: 'mercy',
    },
    {
        name: 'Mei',
        role: 'Damage',
        imgName: 'mei',
        dataName: 'mei',
    },
    {
        name: 'Moira',
        role: 'Support',
        imgName: 'moira',
        dataName: 'moira',
    },
    {
        name: 'Orisa',
        role: 'Tank',
        imgName: 'orisa',
        dataName: 'orisa',
    },
    {
        name: 'Pharah',
        role: 'Damage',
        imgName: 'pharah',
        dataName: 'pharah',
    },
    {
        name: 'Reaper',
        role: 'Damage',
        imgName: 'reaper',
        dataName: 'reaper',
    },
    {
        name: 'Reinhardt',
        role: 'Tank',
        imgName: 'reinhardt',
        dataName: 'reinhardt',
    },
    {
        name: 'Roadhog',
        role: 'Tank',
        imgName: 'roadhog',
        dataName: 'roadhog',
    },
    {
        name: 'Sigma',
        role: 'Tank',
        imgName: 'sigma',
        dataName: 'sigma',
    },
    {
        name: 'Soldier: 76',
        role: 'Damage',
        imgName: 'soldier-76',
        dataName: 'soldier',
    },
    {
        name: 'Sombra',
        role: 'Damage',
        imgName: 'sombra',
        dataName: 'sombra',
    },
    {
        name: 'Symmetra',
        role: 'Damage',
        imgName: 'symmetra',
        dataName: 'symmetra',
    },
    {
        name: 'Torbjorn',
        role: 'Damage',
        imgName: 'torbjorn',
        dataName: 'torbjorn',
    },
    {
        name: 'Tracer',
        role: 'Damage',
        imgName: 'tracer',
        dataName: 'tracer',
    },
    {
        name: 'Widowmaker',
        role: 'Damage',
        imgName: 'widowmaker',
        dataName: 'widowmaker',
    },
    {
        name: 'Winston',
        role: 'Tank',
        imgName: 'winston',
        dataName: 'winston',
    },
    {
        name: 'Wrecking Ball',
        role: 'Tank',
        imgName: 'wrecking-ball',
        dataName: 'wreckingball',
    },
    {
        name: 'Zarya',
        role: 'Tank',
        imgName: 'zarya',
        dataName: 'zarya',
    },
    {
        name: 'Zenyatta',
        role: 'Support',
        imgName: 'zenyatta',
        dataName: 'zenyatta',
    }
]
    .map(data => new Hero(data));


