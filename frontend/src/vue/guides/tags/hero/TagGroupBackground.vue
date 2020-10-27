<template>
    <button
            class="tag-type-background"
            v-bind:class="cssClass"
    >
        <slot/>
    </button>
</template>

<script lang="ts">
import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
import TagGroupVso from "@/ts/vso/TagGroupVso";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({
    components: {
        TagGroupFrame,
    },
})
export default class TagGroupBackground extends Vue {
    @Prop({required: true})
    tagGroup: TagGroupVso

    get cssClass(): string {
        if (this.tagGroup.heroes.length > 0) {
            return 'tag-type-' + this.tagGroup.gamerPosition.dataName;
        } else {
            return 'tag-type-invite';
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/css/tags.scss';

.tag-type-background {
    display: inline-table;
    vertical-align: middle;
    border-radius: .5em;
    box-shadow: 0 0 .1em #111;
    border-width: 0;
    font: inherit;
    margin: initial;
    padding: .25em;
    box-sizing: content-box;
    outline: 0;
    cursor: inherit;
}

.tag-type-player {
    background-color: rgba($tag-player-color, .9);
}

.tag-type-teammate {
    background-color: rgba($tag-teammate-color, .9);
}

.tag-type-enemy {
    background-color: rgba($tag-enemy-color, .9);
}

.tag-type-invite {
    background-color: #5f7589;
}
</style>
