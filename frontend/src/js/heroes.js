import Hero from "../js/Hero.js";

export default [
    {
        name: 'Ana',
        role: 'Support',
        imgName: 'ana'
    },
    {
        name: 'Ashe',
        role: 'Damage',
        imgName: 'ashe'
    },
    {
        name: 'Baptiste',
        role: 'Support',
        imgName: 'baptiste'
    },
    {
        name: 'Bastion',
        role: 'Damage',
        imgName: 'bastion'
    },
    {
        name: 'Brigitte',
        role: 'Support',
        imgName: 'brigitte'
    },
    {
        name: 'D.Va',
        role: 'Tank',
        imgName: 'dva'
    },
    {
        name: 'Doomfist',
        role: 'Damage',
        imgName: 'doomfist'
    },
    {
        name: 'Echo',
        role: 'Damage',
        imgName: 'echo'
    },
    {
        name: 'Genji',
        role: 'Damage',
        imgName: 'genji'
    },
    {
        name: 'Hanzo',
        role: 'Damage',
        imgName: 'hanzo'
    },
    {
        name: 'Junkrat',
        role: 'Damage',
        imgName: 'junkrat'
    },
    {
        name: 'Lucio',
        role: 'Support',
        imgName: 'lucio'
    },
    {
        name: 'McCree',
        role: 'Damage',
        imgName: 'mccree'
    },
    {
        name: 'Mercy',
        role: 'Support',
        imgName: 'mercy'
    },
    {
        name: 'Mei',
        role: 'Damage',
        imgName: 'mei'
    },
    {
        name: 'Moira',
        role: 'Support',
        imgName: 'moira'
    },
    {
        name: 'Orisa',
        role: 'Tank',
        imgName: 'orisa'
    },
    {
        name: 'Pharah',
        role: 'Damage',
        imgName: 'pharah'
    },
    {
        name: 'Reaper',
        role: 'Damage',
        imgName: 'reaper'
    },
    {
        name: 'Reinhardt',
        role: 'Tank',
        imgName: 'reinhardt'
    },
    {
        name: 'Roadhog',
        role: 'Tank',
        imgName: 'roadhog'
    },
    {
        name: 'Sigma',
        role: 'Tank',
        imgName: 'sigma'
    },
    {
        name: 'Soldier: 76',
        role: 'Damage',
        imgName: 'soldier-76'
    },
    {
        name: 'Sombra',
        role: 'Damage',
        imgName: 'sombra'
    },
    {
        name: 'Symmetra',
        role: 'Damage',
        imgName: 'symmetra'
    },
    {
        name: 'Torbjorn',
        role: 'Damage',
        imgName: 'torbjorn'
    },
    {
        name: 'Tracer',
        role: 'Damage',
        imgName: 'tracer'
    },
    {
        name: 'Widowmaker',
        role: 'Damage',
        imgName: 'widowmaker'
    },
    {
        name: 'Winston',
        role: 'Tank',
        imgName: 'winston'
    },
    {
        name: 'Wrecking Ball',
        role: 'Tank',
        imgName: 'wrecking-ball'
    },
    {
        name: 'Zarya',
        role: 'Tank',
        imgName: 'zarya'
    },
    {
        name: 'Zenyatta',
        role: 'Support',
        imgName: 'zenyatta'
    }
]
    .map(data => new Hero(data));


