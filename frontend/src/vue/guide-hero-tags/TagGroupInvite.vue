<template>
    <TagGroupBackground class="invite">
        <slot/>
    </TagGroupBackground>
</template>

<script>

    import TagGroupBackground from "@/vue/guide-hero-tags/TagGroupBackground";

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
        display: inline-block;
        line-height: 2.707em;
        vertical-align: middle;
        width: 3em;
        padding: .3em;
        height: 2.707em;
        background-color: #5f7589;
        color: #32323b;
        cursor: pointer;
    }
</style>
