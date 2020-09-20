<template>
    <div class="wrap" style="text-align: center;">
        <TrainingGoals style="margin: 0 auto;"/>
    </div>
</template>

<script lang="ts">
import Backend from "@/ts/Backend";
import axios from 'axios';
import TrainingGoals from "@/vue/guides/TrainingGoals";
import Vue from 'vue'
import Component from "vue-class-component";

const backend = new Backend(axios);

@Component({
    components: {
        TrainingGoals,
    },
})
export default class TestingGround extends Vue {
};

</script>

<style lang="scss" scoped>
</style>
