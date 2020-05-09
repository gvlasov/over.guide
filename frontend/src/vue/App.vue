<template>
    <div class="app">
        <h1 class="overwatch-font-shadowed">Overwatch Counters</h1>
        <CountersPractice/>
        <!--        <Roster :on-hero-click="heroTest"/>-->
    </div>
</template>

<script>
    import CountersPractice from '../vue/CountersPractice.vue';

    export default {
        methods: {

        },
        components: {
            CountersPractice: CountersPractice,
        },
    }
</script>

<style scoped>
    .app {
        text-align: center;
    }
</style>
