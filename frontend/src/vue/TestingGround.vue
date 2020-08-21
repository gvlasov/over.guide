<template>
    <div class="wrap" style="text-align: center;">
        <TrainingGoals style="margin: 0 auto;"/>
    </div>
</template>

<script>
    import Backend from "@/js/Backend";
    import axios from 'axios';
    import TrainingGoals from "@/vue/guides/TrainingGoals";

    const backend = new Backend(axios);

    export default {
        props: {},
        methods: {
        },
        data() {
            return {
            };
        },
        components: {
            TrainingGoals,
        },
    };

</script>

<style scoped>
</style>
