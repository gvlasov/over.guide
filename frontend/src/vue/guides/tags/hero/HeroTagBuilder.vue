<template>
    <div class="tag-builder">
        <div class="selected-tags">
            <TagGroupFrame :tag-group="descriptor.players">
                <template slot="infix"></template>
                <template slot="frame-content">
                    <TagGroupBackground
                            v-if="descriptor.players.heroes.length > 0"
                            :tag-group="descriptor.players"
                            class="tag-type-links-wrap-player tappable-background"
                            v-hammer:tap="() => (selecting = descriptor.players.gamerPosition)"
                    >
                        <TagGroupHeroes :tag-group="descriptor.players"/>
                    </TagGroupBackground>
                    <TagGroupInvite
                            v-else
                            :tag-group="descriptor.players"
                            v-hammer:tap="() => (selecting = descriptor.players.gamerPosition)"
                            class="invite"
                    />
                </template>
            </TagGroupFrame>
            <TagGroupFrame
                    :tag-group="descriptor.teammates"
            >
                <template slot="infix">+</template>
                <template slot="frame-content">
                    <TagGroupBackground
                            v-if="descriptor.teammates.heroes.length > 0"
                            :tag-group="descriptor.teammates"
                            class="tag-type-links-wrap-teammate tappable-background"
                            v-hammer:tap="() => (selecting = descriptor.teammates.gamerPosition)"
                    >
                        <TagGroupHeroes :tag-group="descriptor.teammates"/>
                    </TagGroupBackground>
                    <TagGroupInvite
                            v-else
                            :tag-group="descriptor.teammates"
                            v-hammer:tap="() => (selecting = descriptor.teammates.gamerPosition)"
                            class="invite"
                    />
                </template>
            </TagGroupFrame>
            <TagGroupFrame
                    :tag-group="descriptor.enemies"
            >
                <template slot="infix">VS</template>
                <template slot="frame-content">
                    <TagGroupBackground
                            v-if="descriptor.enemies.heroes.length > 0"
                            :tag-group="descriptor.enemies"
                            class="tag-type-links-wrap-enemy tappable-background"
                            v-hammer:tap="() => (selecting = descriptor.enemies.gamerPosition)"
                    >
                        <TagGroupHeroes :tag-group="descriptor.enemies"/>
                    </TagGroupBackground>
                    <TagGroupInvite
                            v-else
                            :tag-group="descriptor.enemies"
                            v-hammer:tap="() => (selecting = descriptor.enemies.gamerPosition)"
                            class="invite"
                    />
                </template>
            </TagGroupFrame>
        </div>
        <ModalPopup
                v-if="selecting && selecting.isPlayer"
                @close="selecting = null"
        >
            <HeroTagBuilderRoster
                    slot="default"
                    :gamer-position="gamerPositions.players"
                    v-model="localDescriptor"
                    @tagGroupSelect="($event) => {selecting = $event;}"
                    @save="onRosterDone"
            />
            <template slot="background">
                <ModalBackground class="player-modal-background"/>
            </template>
        </ModalPopup>
        <ModalPopup
                v-if="selecting && selecting.isTeammate"
                @close="selecting = null"
        >
            <HeroTagBuilderRoster
                    slot="default"
                    :gamer-position="gamerPositions.teammates"
                    v-model="localDescriptor"
                    @tagGroupSelect="($event) => {selecting = $event;}"
                    @save="onRosterDone"
            />
            <template slot="background">
                <ModalBackground class="teammate-modal-background"/>
            </template>
        </ModalPopup>
        <ModalPopup
                v-if="selecting && selecting.isEnemy"
                @close="selecting = null"
        >
            <HeroTagBuilderRoster
                    slot="default"
                    v-model="localDescriptor"
                    :gamer-position="gamerPositions.enemies"
                    @tagGroupSelect="($event) => {selecting = $event;}"
                    @save="onRosterDone"
            />
            <template slot="background">
                <ModalBackground class="enemy-modal-background"/>
            </template>
        </ModalPopup>
    </div>
</template>

<script lang="ts">
import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
import TagGroupInvite from "@/vue/guides/tags/hero/TagGroupInvite";
import HeroTagBuilderRoster from "@/vue/guides/tags/hero/HeroTagBuilderRoster";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import TagGroupHeroes from "@/vue/guides/tags/hero/TagGroupHeroes";
import GamerPositionVso from "@/ts/vso/GamerPositionVso";
import Vue from 'vue'
import {Model} from "vue-property-decorator";
import Component from "vue-class-component";
import ModalPopup from "@/vue/general/ModalPopup.vue";
import ModalBackground from "@/vue/general/ModalBackground.vue";

@Component({
    components: {
        ModalBackground,
        ModalPopup,
        TagGroupInvite,
        TagGroupBackground,
        TagGroupFrame,
        HeroTagBuilderRoster,
        TagGroupHeroes,
    },
})
export default class HeroTagBuilder extends Vue {
    @Model('descriptorChange', {required: true})
    descriptor: GuideDescriptorVso

    selecting: GamerPositionVso | null = null

    gamerPositions = {
        players: GamerPositionVso.Players,
        teammates: GamerPositionVso.Teammates,
        enemies: GamerPositionVso.Enemies,
    }

    get localDescriptor() {
        return this.descriptor
    }

    set localDescriptor(descriptor: GuideDescriptorVso) {
        this.$emit('descriptorChange', descriptor)
    }

    onRosterDone() {
        this.selecting = null;
        this.$emit('done')
    }

}
</script>

<style lang="scss" scoped>
@import "~@/assets/css/tags.scss";
.tag-builder {
    max-width: 100%;
    padding: 0 .5em 0 .5em;
    box-sizing: border-box;

    .selected-tags {
        max-width: 100%;
        overflow: scroll;
        overscroll-behavior-x: contain;
        &::-webkit-scrollbar {
            display: none;
        }
        display: inline-flex;

        .tappable-background {
            cursor: pointer;
        }
    }

}
.enemy-modal-background {
    background-color: rgba(darken($tag-enemy-color, 50%), .9)
}
.teammate-modal-background {
    background-color: rgba(darken($tag-teammate-color, 66%), .9)
}
.player-modal-background {
    background-color: rgba(darken($tag-player-color, 54%), .9)
}
</style>
