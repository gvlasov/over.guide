<template>
    <div
            class="tag-custom-badge"
            v-bind:class="tag.cssClass"
    >
        <span v-html="tag.value"></span>
    </div>
</template>

<script>

    export default {
        props: {
            tag: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {};
        },
        methods: {},
        computed: {},
        components: {},
    };
</script>

<style lang="scss" scoped>
    @import "~@/assets/css/overwatch-ui.scss";
    @import "~@/assets/css/tags.scss";

    .tag-custom-badge {
        @include overwatch-futura;
        display: inline-block;
        padding: .3em;
        border-radius: .3em;
        font-weight: bold;
        margin: 0 .2em .2em 0;
        vertical-align: middle !important;
        color: black;
    }

    .theme {
        @include tag-bg-theme;
    }

    .map {
        @include tag-bg-map;
    }
</style>