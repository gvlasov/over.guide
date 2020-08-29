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
                <div class="tag-builder-roster-content">
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
                                    :gamer-position="gamerPosition"
                                    @heroSelect="onHeroTap"
                                    @skillSelectionStart="() => {selectingSkills = true}"
                                    :abilities="selectedHeroAbilities(hero)"
                                    :tag-group-abilities="tagGroup.abilities"
                            />
                            <div
                                    class="clear-button-wrap"
                                    v-if="shouldHaveClearButtonOnGroupRow(group)"
                            >
                                <OverwatchButton
                                        v-bind:style="{'visibility': selectedHeroesInGroup().length > 0 ? 'visible' : 'hidden'}"
                                        :type="'default'"
                                        class="clear-button"
                                        v-hammer:tap="() => tagGroup.heroes = []"
                                >
                                    <div class="unskew-clear-button">Clear</div>
                                </OverwatchButton>
                            </div>
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
                                    :selected-position="gamerPosition"
                                    @playerTap="()=>{selectingSkills = false; $emit('tagGroupSelect', descriptor.players.gamerPosition)}"
                                    @allyTap="()=>{selectingSkills = false; $emit('tagGroupSelect', descriptor.allies.gamerPosition)}"
                                    @enemyTap="()=>{selectingSkills = false; $emit('tagGroupSelect', descriptor.enemies.gamerPosition)}"
                            />
                        </div>
                    </div>
                </div>
                <div
                        class="aside-button aside-button-done"
                        v-hammer:tap="onDoneTap"
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
import Roster_SelectedHeroesMixin
    from "@/vue/roster/Roster_SelectedHeroesMixin";
import HeroGroupsByRole from "@/js/HeroGroupsByRole";
import AbilityIcon from "@/vue/AbilityIcon";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import TagBuilderRosterTag from "@/vue/guides/tags/hero/TagBuilderRosterTag"
import OverwatchButton from "@/vue/OverwatchButton";
import Role from "data/Role";
import GamerPositionVso from "@/js/vso/GamerPositionVso";


export default {
        mixins: [
            Roster_SelectedHeroesMixin,
        ],
        props: {
            gamerPosition: {
                type: GamerPositionVso,
                required: true,
            },
            initialDescriptor: {
                type: GuideDescriptorVso,
                required: true,
            },
        },
        data() {
            return {
                selectingSkills: false,
                heroGroups: HeroGroupsByRole.ALL,
                descriptor: this.initialDescriptor.clone(),
            };
        },
        methods: {
            onDoneTap() {
                this.$emit('save', this.descriptor)
            },
            selectedHeroAbilities(hero) {
                return this.descriptor
                    .getGroupByGamerPosition(this.gamerPosition)
                    .abilities
                    .filter(ability => ability.hero.id === hero.id)
            },
            selectedHeroesInGroup() {
                return this.selectedHeroes.filter(h => this.tagGroup.heroes.find(gh => gh.id === h.id));
            },
            shouldHaveClearButtonOnGroupRow(group) {
                return group[0].role === Role.Support;
            },
        },
        watch: {
            initialDescriptor(newValue) {
                this.descriptor = newValue;
            },
        },
        computed: {
            /**
             * @see Roster_SelectedHeroesMixin
             */
            selectedHeroes() {
                return this.tagGroup.heroes;
            },
            tagGroup() {
                return this.descriptor.getGroupByGamerPosition(this.gamerPosition);
            }
        },
        beforeMount() {
            if (typeof window.orientation !== 'undefined') {
                document.documentElement.requestFullscreen()
            }
        },
        components: {
            OverwatchButton,
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
        justify-content: space-evenly;
        align-content: center;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 100vw;
        height: 100vh;
        position: relative;
        max-width: 73em;
        max-height: 35em;
        line-height: 1em;
    }

    .tag-builder-roster-content {
        display: flex;
        flex-grow: 1;
        justify-content: center;
        align-content: center;
        flex-direction: column;
        flex-wrap: nowrap;
    }

    .tag-builder-roster-wrap {
        width: 100vw;
        height: 100vh;
        line-height: 100vh;
        vertical-align: top;
    }

    .roster {
        flex-grow: 0;
        flex-shrink: 1;
        flex-basis: auto;
        overflow-y: auto;
        width: 100%;
        /*max-width: calc(100% - 18rem);*/
        display: flex;
        flex-direction: column;
        justify-content: end;
        margin: 0 auto;
    }

    .ability-select-wrap {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
        overflow-y: auto;
        overscroll-behavior: none contain;
        width: 100%;
        max-width: 100%;
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
        justify-content: center;
        flex-direction: column;
        flex-basis: 9rem;
        font-size: 2em;
        flex-shrink: 0;
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

    .roster-fixedbox-bg {
        opacity: .9;
        background-color: hsl(40, 70%, 3%);
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

    .role-group {
        display: flex;
        justify-content: center;
    }

    .clear-button-wrap {
        display: inline-block;
        position: relative;
        /* https://stackoverflow.com/a/14896313/1542343 */
        transform: skew(-25deg);
        vertical-align: bottom;
        width: 9.4%;
    }

    .unskew-clear-button {
        transform: skew(25deg);
    }

    .clear-button {
        margin-left: .3em;
        height: 100%;
        vertical-align: top;
        font-size: .9em;
        border-radius: .3em;
        width: 100%;
        border: .08vw solid transparent;
    }

    .clear-button ::v-deep .content {
        padding-left: 12%;
        padding-right: 12%;
    }

    .clear-button ::v-deep .background {
        border-radius: .3em;
    }

    @media screen and (orientation: portrait) {
        .tag-builder-roster {
            flex-direction: column;
            min-height: 100vh;
        }
        .tag-builder-roster-wrap {
            line-height: normal;
        }

        .navigation-arrow {
            display: none;
        }

        .arrow-text {
            position: static;
            left: auto;
            transform: none;
        }

        .aside-button {
            flex-basis: 7rem;
        }
    }

</style>
