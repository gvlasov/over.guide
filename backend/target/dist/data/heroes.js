"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HeroDto_1 = __importDefault(require("./dto/HeroDto"));
const Role_1 = __importDefault(require("./Role"));
const HeroDataNames_1 = __importDefault(require("./HeroDataNames"));
const HeroId_1 = __importDefault(require("./HeroId"));
const data = [
    {
        name: 'Ana',
        id: HeroId_1.default.Ana,
        role: Role_1.default.Support,
        imgName: 'ana',
        dataName: HeroDataNames_1.default.Ana,
    },
    {
        name: 'Ashe',
        id: HeroId_1.default.Ashe,
        role: Role_1.default.Damage,
        imgName: 'ashe',
        dataName: HeroDataNames_1.default.Ashe,
    },
    {
        name: 'Baptiste',
        id: HeroId_1.default.Baptiste,
        role: Role_1.default.Support,
        imgName: 'baptiste',
        dataName: HeroDataNames_1.default.Baptiste,
    },
    {
        name: 'Bastion',
        id: HeroId_1.default.Bastion,
        role: Role_1.default.Damage,
        imgName: 'bastion',
        dataName: HeroDataNames_1.default.Bastion,
    },
    {
        name: 'Brigitte',
        id: HeroId_1.default.Brigitte,
        role: Role_1.default.Support,
        imgName: 'brigitte',
        dataName: HeroDataNames_1.default.Brigitte,
    },
    {
        name: 'D.Va',
        id: HeroId_1.default.Dva,
        role: Role_1.default.Tank,
        imgName: 'dva',
        dataName: HeroDataNames_1.default.Dva,
    },
    {
        name: 'Doomfist',
        id: HeroId_1.default.Doomfist,
        role: Role_1.default.Damage,
        imgName: 'doomfist',
        dataName: HeroDataNames_1.default.Doomfist,
    },
    {
        name: 'Echo',
        id: HeroId_1.default.Echo,
        role: Role_1.default.Damage,
        imgName: 'echo',
        dataName: HeroDataNames_1.default.Echo,
    },
    {
        name: 'Genji',
        id: HeroId_1.default.Genji,
        role: Role_1.default.Damage,
        imgName: 'genji',
        dataName: HeroDataNames_1.default.Genji,
    },
    {
        name: 'Hanzo',
        id: HeroId_1.default.Hanzo,
        role: Role_1.default.Damage,
        imgName: 'hanzo',
        dataName: HeroDataNames_1.default.Hanzo,
    },
    {
        name: 'Junkrat',
        id: HeroId_1.default.Junkrat,
        role: Role_1.default.Damage,
        imgName: 'junkrat',
        dataName: HeroDataNames_1.default.Junkrat,
    },
    {
        name: 'Lucio',
        id: HeroId_1.default.Lucio,
        role: Role_1.default.Support,
        imgName: 'lucio',
        dataName: HeroDataNames_1.default.Lucio,
    },
    {
        name: 'McCree',
        id: HeroId_1.default.McCree,
        role: Role_1.default.Damage,
        imgName: 'mccree',
        dataName: HeroDataNames_1.default.McCree,
    },
    {
        name: 'Mercy',
        id: HeroId_1.default.Mercy,
        role: Role_1.default.Support,
        imgName: 'mercy',
        dataName: HeroDataNames_1.default.Mercy,
    },
    {
        name: 'Mei',
        id: HeroId_1.default.Mei,
        role: Role_1.default.Damage,
        imgName: 'mei',
        dataName: HeroDataNames_1.default.Mei,
    },
    {
        name: 'Moira',
        id: HeroId_1.default.Moira,
        role: Role_1.default.Support,
        imgName: 'moira',
        dataName: HeroDataNames_1.default.Moira,
    },
    {
        name: 'Orisa',
        id: HeroId_1.default.Orisa,
        role: Role_1.default.Tank,
        imgName: 'orisa',
        dataName: HeroDataNames_1.default.Orisa,
    },
    {
        name: 'Pharah',
        id: HeroId_1.default.Pharah,
        role: Role_1.default.Damage,
        imgName: 'pharah',
        dataName: HeroDataNames_1.default.Pharah,
    },
    {
        name: 'Reaper',
        id: HeroId_1.default.Reaper,
        role: Role_1.default.Damage,
        imgName: 'reaper',
        dataName: HeroDataNames_1.default.Reaper,
    },
    {
        name: 'Reinhardt',
        id: HeroId_1.default.Reinhardt,
        role: Role_1.default.Tank,
        imgName: 'reinhardt',
        dataName: HeroDataNames_1.default.Reinhardt,
    },
    {
        name: 'Roadhog',
        id: HeroId_1.default.Roadhog,
        role: Role_1.default.Tank,
        imgName: 'roadhog',
        dataName: HeroDataNames_1.default.Roadhog,
    },
    {
        name: 'Sigma',
        id: HeroId_1.default.Sigma,
        role: Role_1.default.Tank,
        imgName: 'sigma',
        dataName: HeroDataNames_1.default.Sigma,
    },
    {
        name: 'Soldier: 76',
        id: HeroId_1.default.Soldier,
        role: Role_1.default.Damage,
        imgName: 'soldier-76',
        dataName: HeroDataNames_1.default.Soldier,
    },
    {
        name: 'Sombra',
        id: HeroId_1.default.Sombra,
        role: Role_1.default.Damage,
        imgName: 'sombra',
        dataName: HeroDataNames_1.default.Sombra,
    },
    {
        name: 'Symmetra',
        id: HeroId_1.default.Symmetra,
        role: Role_1.default.Damage,
        imgName: 'symmetra',
        dataName: HeroDataNames_1.default.Symmetra,
    },
    {
        name: 'Torbjorn',
        id: HeroId_1.default.Torbjorn,
        role: Role_1.default.Damage,
        imgName: 'torbjorn',
        dataName: HeroDataNames_1.default.Torbjorn,
    },
    {
        name: 'Tracer',
        id: HeroId_1.default.Tracer,
        role: Role_1.default.Damage,
        imgName: 'tracer',
        dataName: HeroDataNames_1.default.Tracer,
    },
    {
        name: 'Widowmaker',
        id: HeroId_1.default.Widowmaker,
        role: Role_1.default.Damage,
        imgName: 'widowmaker',
        dataName: HeroDataNames_1.default.Widowmaker,
    },
    {
        name: 'Winston',
        id: HeroId_1.default.Winston,
        role: Role_1.default.Tank,
        imgName: 'winston',
        dataName: HeroDataNames_1.default.Winston,
    },
    {
        name: 'Wrecking Ball',
        id: HeroId_1.default.WreckingBall,
        role: Role_1.default.Tank,
        imgName: 'wrecking-ball',
        dataName: HeroDataNames_1.default.WreckingBall,
    },
    {
        name: 'Zarya',
        id: HeroId_1.default.Zarya,
        role: Role_1.default.Tank,
        imgName: 'zarya',
        dataName: HeroDataNames_1.default.Zarya,
    },
    {
        name: 'Zenyatta',
        id: HeroId_1.default.Zenyatta,
        role: Role_1.default.Support,
        imgName: 'zenyatta',
        dataName: HeroDataNames_1.default.Zenyatta,
    }
];
const map = new Map();
data.forEach(d => {
    const hero = {
        name: d.name,
        dataName: d.dataName,
        role: d.role,
        id: d.id
    };
    map.set(d.id, hero);
});
exports.default = map;
//# sourceMappingURL=heroes.js.map