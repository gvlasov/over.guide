<template>
    <div class="root">
        <div class="wrap">
            <TagGroupFrame :tag-group="descriptor.players">
                <template slot="infix"></template>
                <template slot="frame-content">
                    <TagGroupBackground
                            v-if="descriptor.players.heroes.length > 0"
                            :tag-group="descriptor.players"
                            class="tag-type-links-wrap-player tappable-background"
                            v-hammer:tap="() => (selecting = descriptor.players.gamerPosition)"
                            v-bind:class="selecting && selecting.isPlayer ? 'selected-group' : ''"
                    >
                        <TagGroupHeroes :tag-group="descriptor.players"/>
                    </TagGroupBackground>
                    <TagGroupInvite
                            v-else
                            :tag-group="descriptor.players"
                            v-hammer:tap="() => (selecting = descriptor.players.gamerPosition)"
                            v-bind:class="selecting && selecting.isPlayer ? 'selected-group' : ''"
                            class="invite"
                    />
                </template>
            </TagGroupFrame>
            <TagGroupFrame
                    :tag-group="descriptor.allies"
            >
                <template slot="infix">+</template>
                <template slot="frame-content">
                    <TagGroupBackground
                            v-if="descriptor.allies.heroes.length > 0"
                            :tag-group="descriptor.allies"
                            class="tag-type-links-wrap-ally tappable-background"
                            v-hammer:tap="() => (selecting = descriptor.allies.gamerPosition)"
                            v-bind:class="selecting && selecting.isAlly ? 'selected-group' : ''"
                    >
                        <TagGroupHeroes :tag-group="descriptor.allies"/>
                    </TagGroupBackground>
                    <TagGroupInvite
                            v-else
                            :tag-group="descriptor.allies"
                            v-hammer:tap="() => (selecting = descriptor.allies.gamerPosition)"
                            v-bind:class="selecting && selecting.isAlly ? 'selected-group' : ''"
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
                            v-bind:class="selecting && selecting.isEnemy ? 'selected-group' : ''"
                            style="max-height: 30px;height:30px;"
                    >
                        <TagGroupHeroes :tag-group="descriptor.enemies"/>
                    </TagGroupBackground>
                    <TagGroupInvite
                            v-else
                            :tag-group="descriptor.enemies"
                            v-hammer:tap="() => (selecting = descriptor.enemies.gamerPosition)"
                            v-bind:class="selecting && selecting.isEnemy ? 'selected-group' : ''"
                            class="invite"
                    />
                </template>
            </TagGroupFrame>
        </div>
        <TagBuilderRoster
                v-if="selecting && selecting.isPlayer"
                :tag-group="descriptor.players"
                :descriptor="descriptor"
                @save="onRosterSave"
                @tagGroupSelect="($event) => {selecting = $event;}"
        />
        <TagBuilderRoster
                v-if="selecting && selecting.isAlly"
                :tag-group="descriptor.allies"
                :descriptor="descriptor"
                @save="onRosterSave"
                @tagGroupSelect="($event) => {selecting = $event;}"
        />
        <TagBuilderRoster
                v-if="selecting && selecting.isEnemy"
                :tag-group="descriptor.enemies"
                :descriptor="descriptor"
                @save="onRosterSave"
                @tagGroupSelect="($event) => {selecting = $event;}"
        />
    </div>
</template>

<script>
import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
import TagGroupInvite from "@/vue/guides/tags/hero/TagGroupInvite";
import TagBuilderRoster from "@/vue/guides/tags/hero/TagBuilderRoster";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import TagGroupHeroes from "@/vue/guides/tags/hero/TagGroupHeroes";
import GamerPositionVso from "@/js/vso/GamerPositionVso";

export default {
    props: {
        descriptor: {
            type: GuideDescriptorVso,
            required: true,
        }
    },
    data() {
        return {
            selecting: null,
            gamerPositions: {
                players: GamerPositionVso.Players,
                allies: GamerPositionVso.Allies,
                enemies: GamerPositionVso.Enemies,
            },
        };
    },
    mounted() {
    },
    methods: {
        onRosterSave() {
            this.selecting = null;
            this.$emit('tagChange');
        },
    },
    computed: {},
    components: {
        TagGroupInvite,
        TagGroupBackground,
        TagGroupFrame,
        TagBuilderRoster,
        TagGroupHeroes,
    },
};

</script>

<style lang="scss" scoped>
.wrap {
    display: inline-flex;
    padding: 0 .5rem 0 .5rem;

    .tappable-background {
        cursor: pointer;
    }
}
</style>
