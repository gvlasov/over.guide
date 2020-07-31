import HeroDto from "data/dto/HeroDto";

export default {
    methods: {
        clearSelection() {
            this.selectedHeroes.splice(0, this.selectedHeroes.length)
        },
        /**
         * @param {HeroDto} hero
         * @return {boolean}
         */
        isHeroSelected(hero) {
            return this.selectedHeroes.find(h => h.dataName === hero.dataName) !== undefined;
        },
        /**
         * @param {HeroDto} hero
         */
        onHeroTap(hero) {
            const index = this.selectedHeroes.findIndex(h => h.dataName === hero.dataName);
            if (index === -1) {
                this.selectedHeroes.push(hero)
            } else {
                this.selectedHeroes.splice(index, 1)
            }
            this.$emit('selectedHeroesChange', this.selectedHeroes);
        },
    },
};
