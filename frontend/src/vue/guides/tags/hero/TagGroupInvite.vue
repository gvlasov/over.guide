<template>
    <TagGroupBackground
            class="invite"
            :tag-group="tagGroup"
    >
        <div class="invite-text">any<br/>{{tagGroup.gamerPosition.dataName}}
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
        background-color: hsl(208, 18%, 52%);
        color: #32323b;
        cursor: pointer;
        box-shadow: $invite-shadow;

        &:hover {
            background-color: hsl(208, 18%, 49%);
            box-shadow: $invite-shadow-hover;

            ::v-deep .invite-text {
                transform: scale(0.9);
            }
        }
    }

    .invite-text {
        display: inline-block;
        line-height: 70%;
        padding-bottom: .25em;
        vertical-align: middle;
        font-variant: all-small-caps;
    }
</style>
