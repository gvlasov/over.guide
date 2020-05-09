<template>
    <div class="root">
        <ul class="role-group" v-for="roleGroup in [tanks, damage, supports]">
            <RosterPortrait
                    v-for="hero in roleGroup"
                    :hero="hero"
                    :isGoodPick="isGoodPick(hero)"
                    style="width: 5vmax; margin: 0.4vmax;"
                    :enabled="isHeroActive(hero)"
                    :banned="hero !== null && isHeroBanned(hero)"
                    v-on:click.native="onPortraitClick(hero)"
            />
        </ul>
    </div>
</template>

<script>
    import heroes from "../js/heroes.js";
    import RosterPortrait from "./RosterPortrait.vue";

    export default {
        props: {
            enabledHeroes: {
                type: Array,
                default() {
                    return new Array(heroes);
                }
            },
            onHeroClick: {
                type: Function,
            },
            bans: {
                type: Array,
            },
            goodPicks: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            /**
             * @param {Hero} hero
             * @return {boolean}
             */
            isHeroActive(hero) {
                return this.enabledHeroes.filter(h => h.name === hero.name).length > 0;
            },
            /**
             * @param {Hero} hero
             * @return {boolean}
             */
            isHeroBanned(hero) {
                return this.bans.filter(h => hero.name === h.name).length > 0;
            },
            isGoodPick(hero) {
                return this.goodPicks
                    .map(hero => hero.dataName)
                    .indexOf(hero.dataName) > -1;
            },
            /**
             * @param {Hero} hero
             */
            onPortraitClick(hero) {
                if (!this.isHeroBanned(hero)) {
                    this.$emit('heroSelect', hero)
                }
            }
        },
        data() {
            const self = this;
            return {
                tanks:
                    [...heroes]
                        .filter(hero => hero.isTank()),
                damage:
                    [...heroes]
                        .filter(hero => hero.isDamage()),
                supports:
                    [...heroes]
                        .filter(hero => hero.isSupport()),
                showName: true,
                onclick: function () {

                }
            }
        },
        components: {
            RosterPortrait: RosterPortrait,
        },
    };

</script>

<style scoped>
    .root {
        display: inline-block;
    }

    .role-group {
        display: inline-block;
    }
</style>
