<template>
    <div class="roster-fixedbox">
        <div class="roster-fixedbox-bg"/>
        <div class="select-wrap">
            <div class="change-roster-cell">
                <div
                        v-if="tagGroup.gamerPosition.getPrevious(false) !== null"
                        class="go-prev"
                        v-hammer:tap="()=>$emit('tagGroupSelect', tagGroup.gamerPosition.getPrevious(false))"
                >
                    <div class="arrow-text">{{tagGroup.gamerPosition.getPrevious(false).plural}}</div>
                    <img src="/icons/arrow-left-white.svg" class="navigation-arrow"/>
                </div>
            </div>
            <div
                    v-if="!selectingSkills"
                    class="roster"
            >
                <div
                        v-for="group in heroGroups.groups"
                        class="role-group"
                >
                    <TagBuilderRosterPortrait
                            v-for="hero in group"
                            v-bind:key="hero.dataName"
                            ref="portraits"
                            :hero="hero"
                            :selected="isHeroSelected(hero)"
                            @heroSelect="onHeroTap"
                            @skillSelectionStart="() => {selectingSkills = true}"
                            :abilities="selectedHeroAbilities(hero)"
                            :tag-group-abilities="tagGroup.abilities"
                    />
                </div>
            </div>
            <div
                    v-if="selectingSkills"
                    class="ability-select-wrap"
            >
                <AbilitySelect
                        :heroes="selectedHeroes"
                        v-model="tagGroup.abilities"
                        class="ability-select"
                />
            </div>
            <div class="button-wrap">
                <OverwatchButton
                        type="main"
                        v-hammer:tap="() => {$emit('save')}"
                        class="hanging-button"
                >Done
                </OverwatchButton>
                <OverwatchButton
                        v-if="!selectingSkills && selectedHeroes.length > 0"
                        type="default"
                        v-hammer:tap="() => {selectingSkills = true}"
                        class="hanging-button"
                >
                    <div
                            v-if="selectedHeroes.length > 0 && tagGroup.abilities.length > 0"
                            class="button-icon-group-holder"
                    >
                        <div class="ability-icon-table">
                            <AbilityIcon
                                    v-for="ability in tagGroup.abilities"
                                    :ability="ability"
                                    :key="ability.dataName"
                                    class="button-group-ability-icon"
                            />
                        </div>
                    </div>
                    <template v-else>Skills</template>
                </OverwatchButton>
                <OverwatchButton
                        v-if="selectingSkills"
                        type="default"
                        v-hammer:tap="() => {selectingSkills = false}"
                >
                    <div
                            class="button-icon-group-holder"
                            v-if="selectedHeroes.length > 0"
                    >
                        <TagPortrait
                                v-for="hero in selectedHeroes"
                                :key="hero.dataName"
                                :hero="hero"
                                class="tag-portrait"
                        />
                    </div>
                    <template v-else>Heroes</template>
                </OverwatchButton>
            </div>
            <div class="change-roster-cell">
                <div
                        v-if="tagGroup.gamerPosition.getNext(false) !== null"
                        class="go-next"
                        v-hammer:tap="()=>$emit('tagGroupSelect', tagGroup.gamerPosition.getNext(false))"
                >
                    <div class="arrow-text">{{tagGroup.gamerPosition.getNext(false).plural}}</div>
                    <img src="/icons/arrow-right-white.svg" class="navigation-arrow"/>
                </div>
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
    import Roster_SelectedHeroesMixin
        from "@/vue/roster/Roster_SelectedHeroesMixin";
    import HeroGroupsByRole from "@/js/HeroGroupsByRole";
    import Tag from "@/vue/guides/tags/hero/Tag";
    import AbilityIcon from "@/vue/AbilityIcon";


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
                selectingSkills: false,
                heroGroups: HeroGroupsByRole.ALL
            };
        },
        methods: {
            /**
             * @param {HeroDto} hero
             */
            selectedHeroAbilities(hero) {
                return this.tagGroup.abilities.filter(ability => ability.hero.id === hero.id)
            }
        },
        computed: {
            selectedHeroes() {
                return this.tagGroup.heroes;
            },
        },
        components: {
            AbilityIcon,
            Tag,
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
        display: flex;
        justify-content: center;
        flex-direction: column;
        flex-wrap: wrap;
        width: 100vh;
        min-width: 100%;
        max-width: 100%;
        height: 100vh;
        min-height: 100vh;
        position: relative;
    }

    .roster {
        display: block;
        flex: 0 1 content;
        width: calc(100vw - 18rem);
        max-width: calc(100vw - 18rem);
    }

    .change-roster-cell {
        display: block;
        flex-basis: 100%;
        width: 9rem;
        color: white;
        font-family: 'Futura Demi Bold', 'sans-serif';
        font-variant: all-small-caps;
        cursor: pointer;
    }

    .change-roster-cell:hover {
        background-color: #222;
    }

    .go-prev, .go-next {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        min-height: 100%;
        font-size: 2em;
    }

    .change-roster-cell:hover > * {
        text-shadow: 0 0 .3em white;
    }

    .ability-select {
        z-index: 2;
        position: relative;
    }

    .ability-select-wrap {
        flex-grow: 0;
        flex-shrink: 1;
        flex-basis: content;
        overflow-y: auto;
        overscroll-behavior: none contain;
        width: 100%;
        padding-top: 2rem;
        max-width: calc(100vw - 18rem);
    }

    .tag-type-links-wrap > a {
        display: table-cell;
        overflow: hidden;
        border-radius: .3em;
    }

    .roster-fixedbox {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2;
        max-width: 100vw;
        max-height: 100vh;
    }

    .roster-fixedbox-bg {
        opacity: .9;
        background-color: black;
        position: fixed;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .button-wrap {
        padding-top: 2rem;
        z-index: 1;
        padding-bottom: 2rem;
    }

    .tag-portrait {
        display: inline-block;
        height: 1em;
        max-height: 1em;
        vertical-align: top;
    }

    .button-group-ability-icon {
        height: .9em;
        width: auto;
    }

    .button-icon-group-holder {
        display: inline-block;
        vertical-align: bottom;
    }

    .ability-icon-table {
        display: flex;
        justify-content: center;
        gap: .5rem;
    }

    .navigation-arrow {
        width: 3em;
    }

</style>
