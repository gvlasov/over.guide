<template>
    <div class="wrap">
        <span class="tag-type-group" v-if="guideHeroTag.playerHeroes.length > 0">
            <span class="tag-type-links-wrap tag-type-links-wrap-player">
                <a
                        v-for="hero in guideHeroTag.playerHeroes"
                        v-bind:href="'/#/guide-browser/'+hero.dataName"
                        v-bind:title="'More guides about playing ' + hero.name">
                    <HeroPortrait
                            v-for="hero in guideHeroTag.playerHeroes"
                            :hero="hero"
                            class="portrait"
                            :base-url="'/images/roster-portraits'"
                    />
                </a>
            </span>
        </span><!-- remove whitespace
        --><span class="tag-type-group" v-if="guideHeroTag.allyHeroes.length > 0">
            <span class="tag-type-infix">+</span>
            <span class="tag-type-links-wrap tag-type-links-wrap-ally">
                <a
                        v-for="hero in guideHeroTag.allyHeroes"
                        v-bind:href="'/#/guide-browser/'+hero.dataName"
                        v-bind:title="'More guides about teaming up with ' + hero.name">
                    <HeroPortrait
                            :hero="hero"
                            class="portrait"
                            :base-url="'/images/roster-portraits'"
                    />
                </a>
            </span>
        </span><!-- remove whitespace
        --><span class="tag-type-group" v-if="guideHeroTag.enemyHeroes.length > 0">
            <span class="tag-type-infix">VS</span>
            <span class="tag-type-links-wrap tag-type-links-wrap-enemy">
                <a
                        v-for="hero in guideHeroTag.enemyHeroes"
                        v-bind:href="'/#/guide-browser/'+hero.dataName"
                        v-bind:title="'More guides about countering ' + hero.name">
                    <HeroPortrait
                            :hero="hero"
                            class="portrait"
                            :base-url="'/images/roster-portraits'"
                    />
                </a>
            </span>
        </span>

    </div>
</template>

<script>
    import HeroPortrait from "@/vue/HeroPortrait";

    export default {
        props: {
            guideHeroTag: {
                /**
                 * @see {GuideHeroTag}
                 */
                type: Object,
            }
        },
        data() {
            return {};
        },
        methods: {},
        computed: {},
        components: {
            HeroPortrait: HeroPortrait
        },
    };

</script>

<style scoped>
    .wrap {
    }

    .portrait {
        width: 3em;
        vertical-align: middle;
        background-color: #28253a;
    }

    .tag-type-group {
        display: inline-table;
    }

    .tag-type-links-wrap {
        border-radius: .3em;
        display: inline-table;
        border-spacing: .3em;
    }

    .tag-type-links-wrap-player {
        background-color: rgba(75, 125, 217, 0.9);
    }

    .tag-type-links-wrap-ally {
        background-color: rgba(15, 213, 71, 0.9);
    }

    .tag-type-links-wrap-enemy {
        background-color: rgba(229, 34, 34, 0.9);
    }

    .tag-type-links-wrap > a {
        display: table-cell;
        overflow: hidden;
        border-radius: .3em;
    }

    .tag-type-links-wrap > a:hover > .portrait {
        transform: scale(1.4);
    }

    .tag-type-infix {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        font-family: 'Futura Demi Bold', sans-serif;
        color: white;
        padding: 0 .2em 0 .2em;
    }

</style>
