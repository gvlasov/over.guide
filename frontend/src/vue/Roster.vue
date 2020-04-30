<template>
    <div>
        <ul class="tanks">
            <HeroPortraitSkewed
                    v-for="hero in tanks"
                    :hero="hero"
                    style="width: 3em;"
                    v-bind:class="{ enabled : isHeroActive(hero), disabled: !isHeroActive(hero)}"
            />
        </ul>
        <ul class="damage">
            <HeroPortraitSkewed
                    v-for="hero in damage"
                    :hero="hero"
                    style="width: 3em;"
                    v-bind:class="{ enabled : isHeroActive(hero), disabled: !isHeroActive(hero)}"
            />
        </ul>
        <ul class="supports">
            <HeroPortraitSkewed
                    v-for="hero in supports"
                    :hero="hero"
                    style="width: 3em;"
                    v-bind:class="{ enabled : isHeroActive(hero), disabled: !isHeroActive(hero)}"
            />
        </ul>
    </div>
</template>

<script>
    import HeroPortraitSkewed from "./HeroPortraitSkewed.vue";
    import heroes from "../js/heroes.js";

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
            }
        },
        methods: {
            /**
             * @param {Hero} hero
             * @return {boolean}
             */
            isHeroActive(hero) {
                console.log(
                    hero.name,
                    this.enabledHeroes.map(h => h.name)
                );
                return this.enabledHeroes.filter(h => h.name === hero.name).length > 0;
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
            HeroPortraitSkewed: HeroPortraitSkewed,
        },
    };

</script>

<style scoped>
    .enabled {
    }

    .disabled {
        display: none !important;
    }
</style>
