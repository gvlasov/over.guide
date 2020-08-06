<template>
    <TagGroupBackground
            class="invite"
            :type="'invite'"
    >
        <div class="invite-text">
            <slot/>
        </div>
    </TagGroupBackground>
</template>

<script>

    import TagGroupBackground from "@/vue/guides/tags/hero/TagGroupBackground";

    export default {
        props: {},
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

<style scoped>
    .invite {
        line-height: 3em;
        height: 3em;
        font-family: 'Futura Demi Bold', 'sans-serif';
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
