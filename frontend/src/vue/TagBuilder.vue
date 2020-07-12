<template>
    <div class="wrap">
        <div class="roster-wrap" v-if="playerSelectionInProgress">
            <Roster
                    :heroes="availableHeroes"
                    :selected-heroes="[...playerHeroes]"
                    @selectedHeroesChange="playerHeroes.replaceAll($event)"
            />
            <button
                    class="overwatch-main-button done-button"
                    v-hammer:tap="() => (playerSelectionInProgress = false)"
            >Done
            </button>
        </div>
        <div class="roster-wrap" v-if="enemySelectionInProgress">
            <Roster
                    :heroes="availableHeroes"
                    :selected-heroes="[...enemyHeroes]"
                    @selectedHeroesChange="enemyHeroes.replaceAll($event)"
            />
            <button
                    class="overwatch-main-button done-button"
                    v-hammer:tap="() => (enemySelectionInProgress = false)"
            >Done
            </button>
        </div>
        <div class="roster-wrap" v-if="allySelectionInProgress">
            <Roster
                    :heroes="availableHeroes"
                    :selected-heroes="[...allyHeroes]"
                    @selectedHeroesChange="allyHeroes.replaceAll($event)"
            />
            <button
                    class="overwatch-main-button done-button"
                    v-hammer:tap="() => (allySelectionInProgress = false)"
            >Done
            </button>
        </div>
        <div v-if="!anySelectionInProgress">
            Play as
            <button class="hero-select" v-hammer:tap="() => (playerSelectionInProgress = true)">
                <HeroPortrait
                        v-for="hero in playerHeroes"
                        :hero="hero"
                        :base-url="'/images/roster-portraits'"
                        class="selected-hero-portrait"
                />
                <span v-if="playerHeroes.length === 0">select</span>
            </button>
        </div>
        <div v-if="!anySelectionInProgress">
            Counter
            <button class="hero-select" v-hammer:tap="() => (enemySelectionInProgress = true)">
                <HeroPortrait
                        v-for="hero in enemyHeroes"
                        :hero="hero"
                        :base-url="'/images/roster-portraits'"
                        class="selected-hero-portrait"
                />
                <span v-if="enemyHeroes.length === 0">select</span>
            </button>
        </div>
        <div v-if="!anySelectionInProgress">
            Synergize with
            <button class="hero-select" v-hammer:tap="() => (allySelectionInProgress = true)">
                <HeroPortrait
                        v-for="hero in allyHeroes"
                        :hero="hero"
                        :base-url="'/images/roster-portraits'"
                        class="selected-hero-portrait"
                />
                <span v-if="allyHeroes.length === 0">select</span>
            </button>
        </div>
        <button v-hammer:tap="save">Save tag</button>
    </div>
</template>

<script>
    import heroes from 'data/heroes'
    import HeroPortrait from "@/vue/HeroPortrait";
    import Roster from "@/vue/Roster";

    export default {
        props: {
            initialPlayerHeroes: {
                type: Array,
                default: () => [],
            },
            initialAllyHeroes: {
                type: Array,
                default: () => [],
            },
            initialEnemyHeroes: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                playerHeroes: this.initialPlayerHeroes,
                allyHeroes: this.initialAllyHeroes,
                enemyHeroes: this.initialEnemyHeroes,
                availableHeroes: Array.from(heroes.values()),
                playerSelectionInProgress: false,
                allySelectionInProgress: false,
                enemySelectionInProgress: false,
            };
        },
        methods: {
            save() {
                this.$emit('save', {
                    playerHeroes: [...this.playerHeroes],
                    allyHeroes: [...this.allyHeroes],
                    enemyHeroes: [...this.enemyHeroes],
                })
            }
        },
        computed: {
            anySelectionInProgress() {
                return this.playerSelectionInProgress
                    || this.enemySelectionInProgress
                    || this.allySelectionInProgress;
            }
        },
        components: {
            Roster,
            HeroPortrait: HeroPortrait
        },
    };

</script>

<style scoped>
    @import '../assets/css/overwatch-ui.css';

    .wrap {
        text-align: left;
        display: block;
    }

    .roster-wrap {
        text-align: center;
    }

    .done-button {
        margin-top: 1em;
    }

    .selected-hero-portrait {
        width: 3em;
        margin: .1em;
    }
</style>
