<template>
    <a
            v-bind:href="'/#/guide-browser/'+hero.dataName"
            v-bind:title="createTitle(hero)"
    >
        <TagPortrait :hero="hero"/>
    </a>
</template>

<script>
    import HeroPortrait from "@/vue/HeroPortrait";
    import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";
    import TagPortrait from "@/vue/guides/tags/hero/TagPortrait";

    export default {
        props: {
            hero: {
                type: Object,
                required: true,
            },
            createTitle: {
                type: Function,
                required: true,
            }
        },
        data() {
            return {};
        },
        methods: {},
        computed: {},
        components: {
            TagPortrait,
            HeroPortrait,
            TagGroupFrame,
        },
    };
</script>

<style scoped>
    a {
        display: table-cell;
        overflow: hidden;
        border-spacing: 0;
    }

    a:hover ::v-deep .portrait {
        transform: scale(1.4);
    }
</style>
