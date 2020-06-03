<template>
    <div class="portrait">
        <HeroPortrait
                :hero="hero"
                :show-name="showName"
                v-flex-touch="(e) => e.preventDefault()"
        />
    </div>
</template>

<script>
    import HeroPortrait from "./HeroPortrait.vue";
    import Hero from "../js/Hero";

    export default {
        props: {
            hero: Hero
        },
        methods: {},
        data() {
            const self = this;
            return {
                showName: true,
            }
        },
        components: {
            HeroPortrait: HeroPortrait
        },
    };

</script>

<style scoped>
    .portrait {
        width: 7vw;
        height: 8vw;
        display: inline-block;
        margin-right: 1vw;
    }

    .portrait > * {
    }
</style>
