<template>
    <TagGroupBackground
            class="invite"
            :tag-group="tagGroup"
            v-bind:class="tagGroup.gamerPosition.dataName"
    >
        <div class="invite-text">any<br/>
            <span style="font-size: .84em;">
            {{ tagGroup.gamerPosition.dataName }}
            </span>
        </div>
    </TagGroupBackground>
</template>

<script>

import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
import TagGroupVso from "@/js/vso/TagGroupVso";

export default {
    props: {
        tagGroup: {
            type: TagGroupVso,
            required: true,
        },
    },
    data() {
        return {};
    },
    methods: {},
    computed: {},
    components: {
        TagGroupBackground
    },
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
    width: 3.9em;
    cursor: pointer;
    box-shadow: 0 .1em .3em -.05em $overwatch-panel-bg-color inset;
}

.invite-text {
    display: inline-block;
    line-height: 70%;
    padding-bottom: .25em;
    vertical-align: middle;
    font-variant: all-small-caps;
}
@function invitify($color) {
    @return desaturate(darken($color, 30), 70)
}

@mixin group($color) {
    color: white;
    text-shadow: $overwatch-panel-bg-shadow;
    background-image: url('/images/background.jpg');
}

.player {
    @include group($tag-player-color);
    background-position-x: 0;
}

.teammate {
    @include group($tag-teammate-color);
    background-position-x: 80px;
}

.enemy {
    @include group($tag-enemy-color);
    background-position-x: 160px;
}
</style>
