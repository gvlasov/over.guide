<template>
    <div class="portrait">
        <HeroPortrait
                :hero="hero"
                :show-name="showName"
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
        width: 5vw;
        height: 5vw;
        border-radius: 2.5vw;
        overflow: hidden;
        display: inline-block;
        margin-right: .6vw;
    }

    .portrait > * {
        top: 65%;
        transform: translateY(-50%);
    }
</style>
