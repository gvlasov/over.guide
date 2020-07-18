<template>
    <TagGroupBackground class="invite">
        <div class="zoomer">
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
        display: inline-block;
        line-height: 2.707rem;
        font-family: 'Futura Demi Bold', 'sans-serif';
        vertical-align: middle;
        width: 3rem;
        padding: .3rem;
        height: 2.707rem;
        background-color: #5f7589;
        color: #32323b;
        cursor: pointer;
    }

    .invite:hover > .zoomer {
        transform: scale(1.2);
    }
</style>
