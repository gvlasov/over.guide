<template>
    <div class="tag">
        <TagGroupFrame
                v-if="descriptor.players.heroes.length > 0"
                :tag-group="descriptor.players"
        >
            <template slot="frame-content">
                <TagGroupBackground
                        v-if="descriptor.players.heroes.length > 0"
                        :tag-group="descriptor.players"
                >
                    <TagGroupHeroes :tag-group="descriptor.players"/>
                </TagGroupBackground>
            </template>
        </TagGroupFrame>
        <TagGroupFrame
                v-if="descriptor.teammates.heroes.length > 0"
                :tag-group="descriptor.teammates"
        >
            <template slot="frame-content">
                <TagGroupBackground
                        v-if="descriptor.teammates.heroes.length > 0"
                        :tag-group="descriptor.teammates"
                >
                    <TagGroupHeroes :tag-group="descriptor.teammates"/>
                </TagGroupBackground>
            </template>
        </TagGroupFrame>
        <TagGroupFrame
                v-if="descriptor.enemies.heroes.length > 0"
                :tag-group="descriptor.enemies"
        >
            <template slot="frame-content">
                <TagGroupBackground
                        v-if="descriptor.enemies.heroes.length > 0"
                        :tag-group="descriptor.enemies"
                >
                    <TagGroupHeroes :tag-group="descriptor.enemies"/>
                </TagGroupBackground>
            </template>
        </TagGroupFrame>
    </div>
</template>

<script lang="ts">
import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import TagGroupHeroes from "@/vue/guides/tags/hero/TagGroupHeroes";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({
    components: {
        TagGroupBackground,
        TagGroupFrame,
        TagGroupHeroes,
    },
})
export default class HeroTag extends Vue {
    @Prop({required: true})
    descriptor: GuideDescriptorVso
}
</script>

<style lang="scss" scoped>
.tag ::v-deep .tag-type-infix {
    display: none;
}
</style>
