import HeroDto from "data/dto/HeroDto";

export default {
    methods: {
        /**
         * @param {HeroDto} hero
         */
        isHeroSelectedOut(hero) {
            return typeof this.selectedOutHeroes.find(h => h.dataName === hero.dataName) !== 'undefined';
        },
    },
};
