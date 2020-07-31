<template>
    <div class="roster-fixedbox">
        <div class="roster-fixedbox-bg"
             v-hammer:tap="onSaveTap"
        />
        <div class="select-wrap">
            <div
                    class="roster"
                    v-if="skillSelectionHero === null"
            >
                <TagBuilderRosterPortrait
                        v-for="hero in heroes"
                        v-bind:key="hero.dataName"
                        ref="portraits"
                        :hero="hero"
                        :selected="isHeroSelected(hero)"
                        @heroSelect="onHeroTap"
                        @skillSelectionStart="onSkillSelectionStart"
                        :abilities="selectedHeroAbilities(hero)"
                />
            </div>
            <AbilitySelect
                    v-if="skillSelectionHero !== null"
                    :hero="skillSelectionHero"
                    v-model="tagGroup.abilities"
                    class="ability-select"
            />
            <div class="button-wrap">
                <OverwatchButton
                        v-if="skillSelectionHero === null"
                        type="main"
                        v-hammer:tap="onSaveTap"
                        class="hanging-button"
                >Save
                </OverwatchButton>
                <OverwatchButton
                        v-if="skillSelectionHero === null"
                        type="default"
                        v-hammer:tap="onClearTap"
                        class="hanging-button"
                >Clear
                </OverwatchButton>
                <OverwatchButton
                        v-if="skillSelectionHero !== null"
                        type="default"
                        v-hammer:tap="() => {skillSelectionHero = null}"
                        class="hanging-button"
                >Heroes
                </OverwatchButton>
            </div>
        </div>
    </div>
</template>

<script>
    import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
    import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
    import TagPortrait from "@/vue/guides/tags/hero/TagPortrait";
    import TagGroupInvite from "@/vue/guides/tags/hero/TagGroupInvite";
    import OverwatchButton from "@/vue/OverwatchButton";
    import TagBuilderRosterPortrait
        from "@/vue/guides/tags/hero/TagBuilderRosterPortrait";
    import AbilitySelect from "@/vue/guides/tags/hero/AbilitySelect";
    import TagGroupVso from "@/js/vso/TagGroupVso";
    import heroes from "data/heroes";
    import Roster_SelectedHeroesMixin
        from "@/vue/roster/Roster_SelectedHeroesMixin";


    export default {
        mixins: [
            Roster_SelectedHeroesMixin,
        ],
        model: {
            prop: 'tagGroup',
            event: 'tagGroupChange',
        },
        props: {
            tagGroup: {
                type: TagGroupVso,
                required: true,
            },
        },
        data() {
            return {
                skillSelectionHero: null,
                heroes: Array.from(heroes.values())
            };
        },
        methods: {
            onClearTap() {
                this.tagGroup.heroes.clear();
                this.tagGroup.abilities.clear();
            },
            onSkillSelectionStart($event) {
                this.skillSelectionHero = $event;
            },
            onSaveTap() {
                this.$emit('save');
            },
            /**
             * @param {HeroDto} hero
             */
            selectedHeroAbilities(hero) {
                return this.tagGroup.abilities.filter(ability => ability.heroId === hero.id)
            }
        },
        computed: {
            selectedHeroes() {
                return this.tagGroup.heroes;
            }
        },
        components: {
            AbilitySelect,
            TagBuilderRosterPortrait,
            OverwatchButton,
            TagGroupInvite,
            TagGroupBackground,
            TagGroupFrame,
            TagPortrait,
        },
    };

</script>

<style scoped>

    .select-wrap {
        position: relative;
        top: 50%;
        transform: translate(0, -50%);
    }

    .roster {
        margin-bottom: 2rem;
    }

    .ability-select {
        z-index: 2;
        position: relative;
    }

    .tag-type-links-wrap > a {
        display: table-cell;
        overflow: hidden;
        border-radius: .3em;
    }

    .tag-type-links-wrap > a:hover > .portrait {
        transform: scale(1.4);
    }

    .roster-fixedbox {
        text-align: center;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2;
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
        margin: auto;
    }

    .roster-fixedbox-bg {
        opacity: .9;
        background-color: black;
        position: absolute;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .roster-fixedbox-bg:hover {
        opacity: .82;
        animation: bgopacity .25s;
    }

    @keyframes bgopacity {
        0% {
            opacity: .9
        }
        100% {
            opacity: .82
        }
    }

    .button-wrap {
        position: absolute;
        bottom: -5rem;
        left: 50%;
        padding-top: 4rem;
        transform: translate(-50%);
        z-index: 1;
    }

</style>
