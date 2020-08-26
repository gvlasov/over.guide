<template>
    <span
            class="tag-type-background"
            v-bind:class="cssClass"
    >
        <slot/>
    </span>
</template>

<script>
import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
import TagGroupVso from "@/js/vso/TagGroupVso";

export default {
    props: {
        tagGroup: {
            type: TagGroupVso,
            required: true,
        }
    },
    data() {
        return {};
    },
    methods: {},
        computed: {
            cssClass() {
                if (this.tagGroup.heroes.length > 0) {
                    return 'tag-type-' + this.tagGroup.gamerPosition.dataName;
                } else {
                    return 'tag-type-invite';
                }
            }
        },
        components: {
            TagGroupFrame,
        },
    };

</script>

<style lang="scss" scoped>
    @import '~@/assets/css/tags.scss';

    .tag-type-background {
        display: inline-table;
        vertical-align: middle;
        border-spacing: .3em;
        border-radius: .5em;
        box-shadow: 0 0 .1em black;
    }

    .tag-type-player {
        background-color: rgba($tag-player-color, .9);
    }

    .tag-type-ally {
        background-color: rgba($tag-ally-color, .9);
    }

    .tag-type-enemy {
        background-color: rgba($tag-enemy-color, .9);
    }

    .tag-type-invite {
        background-color: #5f7589;
    }
</style>
