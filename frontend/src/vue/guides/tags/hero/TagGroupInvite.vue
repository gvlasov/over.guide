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

    .invite {
        @include overwatch-futura;
        line-height: 3em;
        height: 3em;
        vertical-align: middle;
        width: 3.9em;
        background-color: #5f7589;
        color: #32323b;
        cursor: pointer;
    }

    .invite-text {
        display: inline-block;
        line-height: 70%;
        padding-bottom: .33em;
        vertical-align: middle;
        font-variant: all-small-caps;
    }
</style>
