<template>
    <div class="testing-ground">
        <MatchupEvaluator
                :opposition-feed="feed"
        />
    </div>
</template>

<script lang="ts">
import TrainingGoals from "@/vue/guides/TrainingGoals";
import Vue from 'vue'
import Component from "vue-class-component";
import MatchupEvaluator from "@/vue/MatchupEvaluator.vue";
import RandomOppositionFeed from "@/ts/RandomOppositionFeed";


@Component({
    components: {
        MatchupEvaluator,
        TrainingGoals,
    },
})
export default class TestingGround extends Vue {
    feed = new RandomOppositionFeed()
};

</script>

<style lang="scss" scoped>
.testing-ground {
    text-align: center;
    max-height: 18em;
    overflow: visible;
}
</style>
