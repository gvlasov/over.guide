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
                            v-hammer:tap="() => (selecting = 'player')"
                            v-bind:class="selecting === 'player' ? 'selected-group' : ''"
                    >
                        <TagGroupHeroes :tag-group="descriptor.players"/>
                    </TagGroupBackground>
                    <TagGroupInvite
                            v-else
                            :tag-group="descriptor.players"
                            v-hammer:tap="() => (selecting = 'player')"
                            v-bind:class="selecting === 'player' ? 'selected-group' : ''"
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
                            v-hammer:tap="() => (selecting = 'ally')"
                            v-bind:class="selecting === 'ally' ? 'selected-group' : ''"
                    >
                        <TagGroupHeroes :tag-group="descriptor.allies"/>
                    </TagGroupBackground>
                    <TagGroupInvite
                            v-else
                            :tag-group="descriptor.allies"
                            v-hammer:tap="() => (selecting = 'ally')"
                            v-bind:class="selecting === 'ally' ? 'selected-group' : ''"
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
                            v-hammer:tap="() => (selecting = 'enemy')"
                            v-bind:class="selecting === 'enemy' ? 'selected-group' : ''"
                            style="max-height: 30px;height:30px;"
                    >
                        <TagGroupHeroes :tag-group="descriptor.enemies"/>
                    </TagGroupBackground>
                    <TagGroupInvite
                            v-else
                            :tag-group="descriptor.enemies"
                            v-hammer:tap="() => (selecting = 'enemy')"
                            v-bind:class="selecting === 'enemy' ? 'selected-group' : ''"
                            class="invite"
                    />
                </template>
            </TagGroupFrame>
        </div>
        <TagBuilderRoster
                v-if="selecting === 'player'"
                :tag-group="descriptor.players"
                :descriptor="descriptor"
                @save="selecting = null"
                @tagGroupSelect="($event) => {selecting = $event.dataName;}"
        />
        <TagBuilderRoster
                v-if="selecting === 'ally'"
                :tag-group="descriptor.allies"
                :descriptor="descriptor"
                @save="selecting = null"
                @tagGroupSelect="($event) => {selecting = $event.dataName;}"
        />
        <TagBuilderRoster
                v-if="selecting === 'enemy'"
                :tag-group="descriptor.enemies"
                :descriptor="descriptor"
                @save="selecting = null"
                @tagGroupSelect="($event) => {selecting = $event.dataName;}"
        />
    </div>
</template>

<script>
    import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
    import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
    import TagPortrait from "@/vue/guides/tags/hero/TagPortrait";
    import TagGroupInvite from "@/vue/guides/tags/hero/TagGroupInvite";
    import TagBuilderRoster from "@/vue/guides/tags/hero/TagBuilderRoster";
    import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
    import TagGroupHeroes from "@/vue/guides/tags/hero/TagGroupHeroes";

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
            };
        },
        mounted() {
        },
        methods: {},
        computed: {},
        components: {
            TagGroupInvite,
            TagGroupBackground,
            TagGroupFrame,
            TagPortrait,
            TagBuilderRoster,
            TagGroupHeroes,
        },
    };

</script>

<style scoped>
    .wrap {
        display: inline-flex;
        padding: 0 .4rem 0 0;
    }

    .invite ::v-deep .invite-text:hover {
        transform: scale(1.1);
    }
</style>
