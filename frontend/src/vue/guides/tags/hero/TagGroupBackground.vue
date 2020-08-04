<template>
    <span
            class="tag-type-background"
            v-bind:class="'tag-type-' + type"
    >
        <slot/>
    </span>
</template>

<script>
    import TagGroupFrame from "@/vue/guides/tags/hero/TagGroupFrame";

    export default {
        props: {
            type: {
                type: String,
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
    .tag-type-background {
        display: inline-table;
        vertical-align: middle;
        border-spacing: .3rem;
        border-radius: .5rem;
    }

    .tag-type-player {
        background-color: rgba(75, 125, 217, 0.9);
    }

    .tag-type-ally {
        background-color: rgba(15, 213, 71, 0.9);
    }

    .tag-type-enemy {
        background-color: rgba(229, 34, 34, 0.9);
    }

    .tag-type-invite {
        background-color: #5f7589;
    }
</style>
