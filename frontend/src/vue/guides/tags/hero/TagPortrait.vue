<template>
    <div
            style="display: table-cell"
    >
        <HeroPortrait
                class="portrait"
                :hero="hero"
                :base-url="'/images/roster-portraits'"
        />
    </div>
</template>

<script>
    import HeroPortrait from "@/vue/HeroPortrait";

    export default {
        props: {
            hero: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {};
        },
        methods: {},
        computed: {},
        components: {
            HeroPortrait,
        },
    };
</script>

<style lang="scss" scoped>
    @import '~@/assets/css/tags.scss';

    .portrait {
        display: table-cell;
        height: 100%;
        width: auto;
        vertical-align: middle;
    }
</style>
