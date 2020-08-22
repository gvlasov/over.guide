<template>
    <div class="root">
        <!--        <router-link to="/counters-practice">Counters practice</router-link>-->
        <!--        <router-link to="/suggest-pick">Suggest pick</router-link>-->
        <router-link to="/search">Browse guides</router-link>
        <router-link to="/guide-editor">Create guide</router-link>
        <router-link to="/training-goals">Training goals</router-link>
        <router-link to="/testing-ground">Testing ground</router-link>
        <BattlenetAuthButton/>
    </div>
</template>

<script>

    export default {
        methods: {},
        data() {
            return {};
        },
        components: {},
    }
</script>

<style lang="scss" scoped>
    @import "~@/assets/css/overwatch-ui.scss";

    .root {
        font-size: 2em;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: .1em;
        margin-bottom: 1rem;
    }

    a {
        @include overwatch-futura;
        color: white;
        text-decoration: none;
        padding: 0 .5em;
        white-space: nowrap;
        background-color: hsl(206, 80%, 58%);
    }
</style>
