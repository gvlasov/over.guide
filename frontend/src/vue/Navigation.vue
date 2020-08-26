<template>
    <div class="navigation">
        <router-link to="/search">Browse guides</router-link>
        <router-link to="/guide-editor">Create guide</router-link>
        <router-link to="/training-goals">Training goals</router-link>
        <!--        <router-link to="/testing-ground">Testing ground</router-link>-->
        <BattlenetAuthButton/>
    </div>
</template>

<script>
    import BattlenetAuthButton from "@/vue/BattlenetAuthButton";

    export default {
        methods: {},
        data() {
            return {};
        },
        components: {
            BattlenetAuthButton,
        },
    }
</script>

<style lang="scss" scoped>
    @import "~@/assets/css/overwatch-ui.scss";

    .navigation {
        font-size: 1.7em;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        gap: .1em;
        margin-bottom: 1rem;
    }

    a {
        @include overwatch-futura-no-smallcaps;
        color: white;
        text-decoration: none;
        padding: 1rem .4rem 0 .4rem;
        white-space: nowrap;
        text-shadow: 0 0 .2em black;
    }
</style>
