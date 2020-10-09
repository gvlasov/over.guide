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
        <TagBuilderRoster
                v-if="selecting && selecting.isPlayer"
                :gamer-position="gamerPositions.players"
                :descriptor="descriptor"
                @tagGroupSelect="($event) => {selecting = $event;}"
                @save="() => {selecting = null; $emit('done')}"
        />
        <TagBuilderRoster
                v-if="selecting && selecting.isTeammate"
                :gamer-position="gamerPositions.teammates"
                :descriptor="descriptor"
                @tagGroupSelect="($event) => {selecting = $event;}"
                @save="() => {selecting = null; $emit('done')}"
        />
        <TagBuilderRoster
                v-if="selecting && selecting.isEnemy"
                :descriptor="descriptor"
                :gamer-position="gamerPositions.enemies"
                @tagGroupSelect="($event) => {selecting = $event;}"
                @save="() => {selecting = null; $emit('done')}"
        />
    </div>
</template>

<script lang="ts">
import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
import TagGroupInvite from "@/vue/guides/tags/hero/TagGroupInvite";
import TagBuilderRoster from "@/vue/guides/tags/hero/TagBuilderRoster";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import TagGroupHeroes from "@/vue/guides/tags/hero/TagGroupHeroes";
import GamerPositionVso from "@/ts/vso/GamerPositionVso";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({
    components: {
        TagGroupInvite,
        TagGroupBackground,
        TagGroupFrame,
        TagBuilderRoster,
        TagGroupHeroes,
    },
})
export default class HeroTagBuilder extends Vue {
    @Prop({required: true})
    descriptor: GuideDescriptorVso

    selecting: GamerPositionVso | null = null

    gamerPositions = {
        players: GamerPositionVso.Players,
        teammates: GamerPositionVso.Teammates,
        enemies: GamerPositionVso.Enemies,
    }
}
</script>

<style lang="scss" scoped>
.selected-tags {
    display: inline-flex;
    padding: 0 .5rem 0 .5rem;

    .tappable-background {
        cursor: pointer;
    }
}
</style>
