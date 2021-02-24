<template>
    <div class="tag-builder-roster-wrap">
        <div class="tag-builder-roster">
            <div
                    class="aside-button aside-button-mode"
                    v-bind:style="{visibility: tagGroup.heroes.length > 0 ? 'visible' : 'hidden'}"
                    v-hammer:tap="() => selectingSkills = !selectingSkills"
            >
                <div class="aside-content">{{ selectingSkills ? 'Heroes' : 'Skills' }}</div>
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
                        <HeroTagBuilderRosterPortrait
                                v-for="hero in group"
                                v-bind:key="hero.dataName"
                                ref="portraits"
                                :hero="hero"
                                :selected="isHeroSelected(hero)"
                                :gamer-position="gamerPosition"
                                @heroSelect="onHeroTapIfEnabled"
                                @skillSelectionStart="() => {selectingSkills = true}"
                                :abilities="selectedHeroAbilities(hero)"
                                :tag-group-abilities="tagGroup.abilities"
                                :disabled="!isHeroSelected(hero) && hasMaxHeroes"
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
                            :descriptor="draftDescriptor"
                            v-model="tagGroup.abilities"
                            class="ability-select"
                    />
                </div>
                <div class="button-wrap">
                    <div
                            class="tag-builder-roster-tag-wrap"
                            style="">
                        <HeroTagBuilderRosterTag
                                :descriptor="draftDescriptor"
                                class="descriptor-mirror"
                                :selected-position="gamerPosition"
                                @playerTap="()=>{selectingSkills = false; $emit('tagGroupSelect', draftDescriptor.players.gamerPosition)}"
                                @teammateTap="()=>{selectingSkills = false; $emit('tagGroupSelect', draftDescriptor.teammates.gamerPosition)}"
                                @enemyTap="()=>{selectingSkills = false; $emit('tagGroupSelect', draftDescriptor.enemies.gamerPosition)}"
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
</template>

<script lang="ts">
import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
import HeroTagBuilderRosterPortrait
    from "@/vue/guides/tags/hero/HeroTagBuilderRosterPortrait";
import AbilitySelect from "@/vue/guides/tags/hero/AbilitySelect";
import Roster_SelectedHeroesMixin
    from "@/vue/roster/Roster_SelectedHeroesMixin";
import HeroGroupsByRole from "@/ts/HeroGroupsByRole";
import AbilityIcon from "@/vue/AbilityIcon";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import HeroTagBuilderRosterTag
    from "@/vue/guides/tags/hero/HeroTagBuilderRosterTag"
import OverwatchButton from "@/vue/OverwatchButton";
import Role from "data/Role";
import GamerPositionVso from "@/ts/vso/GamerPositionVso";
import Component, {mixins} from "vue-class-component";
import {Model, Prop, Watch} from "vue-property-decorator";
import HeroDto from "data/dto/HeroDto";
import TagGroupVso from "@/ts/vso/TagGroupVso";

@Component({
    components: {
        OverwatchButton,
        AbilityIcon,
        AbilitySelect,
        HeroTagBuilderRosterPortrait,
        TagGroupBackground,
        TagGroupFrame,
        HeroTagBuilderRosterTag,
    },
})
export default class HeroTagBuilderRoster extends mixins(Roster_SelectedHeroesMixin) {

    @Model('descriptorChange', {required: true})
    descriptor: GuideDescriptorVso

    @Prop({required: true})
    gamerPosition: GamerPositionVso

    selectingSkills: boolean = false

    heroGroups: HeroGroupsByRole = HeroGroupsByRole.ALL

    draftDescriptor: GuideDescriptorVso = this.descriptor.clone()

    private readonly maxHeroesNumber: number = 6

    onDoneTap() {
        this.$emit('descriptorChange', this.draftDescriptor)
        this.$emit('save')
    }

    @Watch('descriptor')
    onInputDescriptorChange() {
        this.draftDescriptor = this.descriptor.clone()
    }

    onHeroTapIfEnabled(hero: HeroDto) {
        if (this.hasMaxHeroes && !this.isHeroSelected(hero)) {
            return
        }
        this.onHeroTap(hero)
    }

    get hasMaxHeroes(): boolean {
        return this.draftDescriptor.heroesLength >= this.maxHeroesNumber
    }

    selectedHeroAbilities(hero) {
        return this.draftDescriptor
            .getGroupByGamerPosition(this.gamerPosition)
            .abilities
            .filter(ability => ability.hero.id === hero.id)
    }

    selectedHeroesInGroup() {
        return this.selectedHeroes.filter(h => this.tagGroup.heroes.find(gh => gh.id === h.id));
    }

    shouldHaveClearButtonOnGroupRow(group) {
        return group[0].role === Role.Support;
    }

    /**
     * @see Roster_SelectedHeroesMixin#selectedHeroes
     */
    get selectedHeroes(): HeroDto[] {
        return this.tagGroup.heroes;
    }

    get tagGroup(): TagGroupVso {
        return this.draftDescriptor.getGroupByGamerPosition(this.gamerPosition);
    }

    beforeMount() {
        if (typeof window.orientation !== 'undefined') {
            // document.documentElement.requestFullscreen()
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";
@import "~@/assets/css/common.scss";

.tag-builder-roster-wrap {
    width: 100vw;
    height: 100vh;
    line-height: 100vh;
    vertical-align: top;

    .tag-builder-roster {
        display: inline-flex;
        justify-content: space-evenly;
        align-content: center;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 100vw;
        height: 100vh;
        position: relative;
        max-width: 73rem;
        max-height: 35rem;
        line-height: 1em;


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
    }
}

.tag-builder-roster-content {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    flex-wrap: nowrap;

    .roster {
        flex-grow: 0;
        flex-shrink: 1;
        flex-basis: auto;
        overflow-y: auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: end;
        margin: 0 auto;
        @include custom-desktop-scrollbar(rgba(0, 0, 0, 0), hsla(0, 0, 0, .6));

        .role-group {
            display: flex;
            justify-content: center;

            .clear-button-wrap {
                display: inline-block;
                position: relative;
                /* https://stackoverflow.com/a/14896313/1542343 */
                transform: skew(-25deg);
                vertical-align: bottom;
                width: 9.4%;


                .clear-button {
                    margin-left: .3em;
                    height: 100%;
                    vertical-align: top;
                    font-size: .9em;
                    border-radius: .3em;
                    width: 100%;
                    border: .08vw solid transparent;
                    @media screen and (max-width: 48em) {
                        font-size: .6em;
                    }
                    @media screen and (min-width: 70em) {
                        font-size: 1.5em;
                    }
                }

                .clear-button ::v-deep .content {
                    padding-left: 12%;
                    padding-right: 12%;
                }

                .clear-button ::v-deep .background {
                    border-radius: .3em;
                }

                .unskew-clear-button {
                    transform: skew(25deg);
                }
            }
        }
    }

    .ability-select-wrap {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
        overflow-y: auto;
        overscroll-behavior: none contain;
        width: 100%;
        max-width: 100%;
        margin-top: 2rem;
    }

    .button-wrap {
        flex-shrink: 0;
        flex-basis: content;
        z-index: 1;
        padding-top: 1rem;
        padding-bottom: 1rem;
        max-width: initial;
        text-align: center;
    }
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

@media screen and (orientation: portrait) {
    .tag-builder-roster-wrap {
        line-height: normal;

        .tag-builder-roster {
            flex-direction: column;
            min-height: 100vh;
        }
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
