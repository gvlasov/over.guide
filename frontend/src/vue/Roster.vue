<template>
    <div>
        <ul class="tanks">
            <HeroPortraitSkewed
                    v-for="hero in tanks"
                    :hero="hero"
                    :onclick="e=>onHeroClick(hero)"
                    style="width: 3em;"
            />
        </ul>
        <ul class="damage">
            <HeroPortraitSkewed
                    v-for="hero in damage"
                    :hero="hero"
                    :onclick="e=>onHeroClick(hero)"
                    style="width: 3em;"
            />
        </ul>
        <ul class="supports">
            <HeroPortraitSkewed
                    v-for="hero in supports"
                    :hero="hero"
                    :onclick="e=>onHeroClick(hero)"
                    style="width: 3em;"
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
        methods: {},
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

</style>
