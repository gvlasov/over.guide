<template>
    <TagGroupBackground
            class="invite"
            ref="background"
            :tag-group="tagGroup"
            v-bind:class="tagGroup.gamerPosition.dataName"
    >
        <div class="invite-text">any<br/>
            <span v-bind:style="isTeammate ? 'font-size: .81em;' : ''">
            {{ tagGroup.gamerPosition.dataName }}
            </span>
        </div>
    </TagGroupBackground>
</template>

<script lang="ts">

import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
import TagGroupVso from "@/ts/vso/TagGroupVso";
import GamerPositionVso from "@/ts/vso/GamerPositionVso";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({
    components: {
        TagGroupBackground
    },
})
export default class TagGroupInvite extends Vue {
    @Prop({required: true})
    tagGroup: TagGroupVso

    get isTeammate(): boolean {
        return this.tagGroup.gamerPosition.id === GamerPositionVso.Teammates.id;
    }

    get backgroundScale(): number {
        return Math.max(window.innerHeight / 1000, 1)
    }
};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";
@import "~@/assets/css/tags.scss";

.invite {
    @include overwatch-futura;
    line-height: 3em;
    height: 3em;
    vertical-align: middle;
    width: 3.32em;
    cursor: pointer;
    box-shadow: 0 .1em .3em -.05em $overwatch-panel-bg-color inset;
    //box-shadow: 0 0.05em 0.35em -0.05em inset hsl(279, 29%, 30%);
    background-color: hsl(338, 80%, 96%);

    .invite-text {
        display: inline-block;
        line-height: 70%;
        padding-bottom: .25em;
        vertical-align: middle;
        font-variant: all-small-caps;
    }
}

@function invitify($color) {
    @return desaturate(darken($color, 30), 70)
}

@mixin group($color) {
    color: rgba(81, 96, 148, 0.7);
}

.player {
    @include group($tag-player-color);
}

.teammate {
    @include group($tag-teammate-color);
}

.enemy {
    @include group($tag-enemy-color);
}
</style>
