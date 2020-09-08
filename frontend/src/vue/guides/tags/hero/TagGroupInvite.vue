<template>
    <TagGroupBackground
            class="invite"
            ref="background"
            :tag-group="tagGroup"
            v-bind:class="tagGroup.gamerPosition.dataName"
            v-bind:style="{'background-position-x': backgroundX + 'px', 'background-position-y': backgroundY+'px', 'background-size': 'auto '+(1000*backgroundScale)+'px'}"
    >
        <div class="invite-text">any<br/>
            <span v-bind:style="isTeammate ? 'font-size: .81em;' : ''">
            {{ tagGroup.gamerPosition.dataName }}
            </span>
        </div>
    </TagGroupBackground>
</template>

<script>

import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";
import TagGroupVso from "@/js/vso/TagGroupVso";
import GamerPositionVso from "@/js/vso/GamerPositionVso";

export default {
    props: {
        tagGroup: {
            type: TagGroupVso,
            required: true,
        },
    },
    data() {
        return {
            backgroundX: 0,
            backgroundY: 0,
        };
    },
    methods: {
        adjustBackgroundPosition() {
            const bgWidth = 2560
            const coeff = this.backgroundScale;
            this.backgroundX = -(this.$el.getBoundingClientRect().x + (bgWidth - document.documentElement.clientWidth) / 2) * coeff;
            this.backgroundY = -this.$el.getBoundingClientRect().y * coeff;
        }
    },
    computed: {
        isTeammate() {
            return this.tagGroup.gamerPosition.id === GamerPositionVso.Teammates.id;
        },
        backgroundScale() {
            return  Math.max(window.innerHeight/1000, 1)
        }
    },
    mounted() {
        this.adjustBackgroundPosition()
        window.addEventListener('scroll', () => {
            this.adjustBackgroundPosition()
        })
    },
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
    width: 3.32em;
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
    color: rgba(81, 96, 148, 0.7);
    //text-shadow: $overwatch-panel-bg-shadow;
    background-image: url('/images/candy.jpg');
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
