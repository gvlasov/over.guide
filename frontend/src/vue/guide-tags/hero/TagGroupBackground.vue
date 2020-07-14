<template>
    <span class="tag-type-background">
        <slot/>
    </span>
</template>

<script>
    import TagGroupFrame from "@/vue/guide-tags/hero/TagGroupFrame";

    export default {
        props: {},
        data() {
            return {};
        },
        methods: {},
        computed: {},
        components: {
            TagGroupFrame,
        },
    };

</script>

<style scoped>
    .tag-type-background {
        display: inline-table;
        vertical-align: middle;
        border-spacing: .3em;
        border-radius: .5em;
    }
</style>
