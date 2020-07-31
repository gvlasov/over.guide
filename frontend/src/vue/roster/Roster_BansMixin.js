import HeroDto from "data/dto/HeroDto";

export default {
    props: {
        bans: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        /**
         * @param {HeroDto} hero
         * @return {boolean}
         */
        isHeroBanned(hero) {
            return typeof this.bans.find(h => hero.dataName === h.dataName) !== 'undefined';
        },
    },
};
