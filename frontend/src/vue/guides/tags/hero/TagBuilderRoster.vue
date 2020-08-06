<template>
    <div class="roster-fixedbox" style="">
        <div class="roster-fixedbox-bg"/>
        <div class="tag-builder-roster-wrap">
            <div class="tag-builder-roster">
                <div
                        class="aside-button aside-button-mode"
                        v-bind:style="{visibility: tagGroup.heroes.length > 0 ? 'visible' : 'hidden'}"
                        v-hammer:tap="() => selectingSkills = !selectingSkills"
                >
                    <div class="aside-content">{{selectingSkills ? 'Heroes' : 'Skills'}}</div>
                    <div class="background"></div>
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
                            :heroes="tagGroup.heroes"
                            v-model="tagGroup.abilities"
                            class="ability-select"
                    />
                </div>
                <div class="button-wrap">
                    <div
                            class="tag-builder-roster-tag-wrap"
                            style="">
                        <TagBuilderRosterTag
                                :descriptor="descriptor"
                                class="descriptor-mirror"
                                :selected-position="tagGroup.gamerPosition"
                                @playerTap="()=>{selectingSkills = false; $emit('tagGroupSelect', descriptor.players.gamerPosition)}"
                                @allyTap="()=>{selectingSkills = false; $emit('tagGroupSelect', descriptor.allies.gamerPosition)}"
                                @enemyTap="()=>{selectingSkills = false; $emit('tagGroupSelect', descriptor.enemies.gamerPosition)}"
                        />
                    </div>
                </div>
                <div
                        class="aside-button aside-button-done"
                        v-hammer:tap="()=>$emit('save')"
                >
                    <div class="aside-content">
                        <div class="arrow-text-wrap">
                            <div class="arrow-text">Done</div>
                        </div>
                        <img src="/icons/arrow-right-white.svg" class="navigation-arrow"/>
                    </div>
                    <div class="background"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
    import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
    import TagBuilderRosterPortrait
        from "@/vue/guides/tags/hero/TagBuilderRosterPortrait";
    import AbilitySelect from "@/vue/guides/tags/hero/AbilitySelect";
    import TagGroupVso from "@/js/vso/TagGroupVso";
    import Roster_SelectedHeroesMixin
        from "@/vue/roster/Roster_SelectedHeroesMixin";
    import HeroGroupsByRole from "@/js/HeroGroupsByRole";
    import AbilityIcon from "@/vue/AbilityIcon";
    import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
    import TagBuilderRosterTag from "@/vue/guides/tags/hero/TagBuilderRosterTag"


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
            descriptor: {
                type: GuideDescriptorVso,
                required: true,
            }
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
        },
        components: {
            AbilityIcon,
            AbilitySelect,
            TagBuilderRosterPortrait,
            TagGroupBackground,
            TagGroupFrame,
            TagBuilderRosterTag,
        },
    };

</script>

<style lang="scss" scoped>
    @import "~@/assets/css/overwatch-ui.scss";

    .roster-fixedbox {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        z-index: 3;
        text-align: center;
    }

    .tag-builder-roster {
        display: inline-flex;
        justify-content: center;
        flex-direction: column;
        flex-wrap: wrap;
        width: 100vw;
        height: 100%;
        position: relative;
        max-width: 73em;
        max-height: 35em;
        line-height: 1em;
    }

    .tag-builder-roster-wrap {
        text-align: center;
        width: 100vw;
        height: 100vh;
        line-height: 100vh;
        vertical-align: middle;
    }

    .roster {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
        overflow-y: auto;
        width: calc(100% - 18rem);
        max-width: calc(100% - 18rem);
        padding-top: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: end;
    }

    .ability-select-wrap {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
        overflow-y: auto;
        overscroll-behavior: none contain;
        width: calc(100% - 18rem);
        max-width: calc(100% - 18rem);
        padding-top: 2rem;
    }

    .button-wrap {
        flex-shrink: 0;
        flex-basis: content;
        z-index: 1;
        padding-top: 1rem;
        padding-bottom: 4vh;
        max-width: initial;
        text-align: center;
    }

    .aside-button {
        @include overwatch-button;
        display: flex;
        flex-basis: 100%;
        justify-content: center;
        flex-direction: column;
        width: 9rem;
        font-size: 2em;
        z-index: 2;
    }

    .aside-button-mode > .background {
        @include overwatch-button-bg-default;
    }

    .aside-button-done > .background {
        @include overwatch-button-bg-main;
    }

    .aside-button:hover {
        box-shadow: 0 0 .05em .05em white inset, 0 0 .05em .05em white inset !important;
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

    .roster-fixedbox-bg {
        opacity: .9;
        background-color: black;
        position: fixed;
        width: 100%;
        height: 100%;
        cursor: pointer;
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

    .arrow-text {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -1em);
    }

    .arrow-text-wrap {
        line-height: 0;
        width: 100%;
        position: relative;
    }

    .descriptor-mirror {
        display: inline-block;
        transform: translateX(-50%);
    }

    .tag-builder-roster-tag-wrap {
        display: inline-block;
        max-height: 100%;
        max-width: 0;
        position: relative;
        white-space: nowrap
    }

</style>
