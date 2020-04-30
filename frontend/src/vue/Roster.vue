<template>
    <div>
        <ul class="tanks">
            <HeroPortraitSkewed
                    v-for="hero in tanks"
                    :hero="hero"
                    :onclick="e=>onHeroClick(hero)"
                    style="width: 3em;"
                    v-bind:class="{ enabled : isHeroActive(hero), disabled: !isHeroActive(hero)}"
            />
        </ul>
        <ul class="damage">
            <HeroPortraitSkewed
                    v-for="hero in damage"
                    :hero="hero"
                    :onclick="e=>onHeroClick(hero)"
                    style="width: 3em;"
                    v-bind:class="{ enabled : isHeroActive(hero), disabled: !isHeroActive(hero)}"
            />
        </ul>
        <ul class="supports">
            <HeroPortraitSkewed
                    v-for="hero in supports"
                    :hero="hero"
                    :onclick="e=>onHeroClick(hero)"
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
            onHeroClick: {
                type: Function,
            }
        },
        methods: {
            /**
             * @param {string} category
             */
            selectCategory(category) {
                this.selectedCategories = [category];
            },
            /**
             * @param {Hero} hero
             * @return {boolean}
             */
            isHeroActive(hero) {
                return this.selectedCategories.indexOf(hero.role) > -1;
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
                selectedCategories: [
                    'Tank', 'Support', 'Damage'
                ],
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

    .disable {
        opacity: .5;
    }
</style>
