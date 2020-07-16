<template>
    <span class="tag-type-group-wrap">
        <span class="tag-type-infix">
            <slot name="infix"/>
        </span>
        <slot name="frame-content"/>
    </span>
</template>

<script>
    export default {
        props: {},
        data() {
            return {};
        },
        methods: {},
        computed: {},
        components: {},
    };
</script>

<style scoped>

    .tag-type-group-wrap {
        display: inline-table;
        border-spacing: 0;
    }

    .tag-type-infix {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        font-family: 'Futura Demi Bold', sans-serif;
        color: black;
        padding: 0 .2em 0 .2em;
    }
</style>