<template>
    <TagGroupFrame>
        <template v-slot:infix>
            <slot name="infix"/>
        </template>
        <template v-slot:frame-content>
            <slot name="frame-content"/>
        </template>
    </TagGroupFrame>
</template>

<script>
    import TagGroupFrame from "@/vue/guide-hero-tags/TagGroupFrame";

    export default {
        props: {
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
            TagGroupFrame,
        },
    };
</script>

<style scoped>
</style>
