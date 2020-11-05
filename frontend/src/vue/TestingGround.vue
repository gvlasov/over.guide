<template>
    <div class="testing-ground">
        <MatchupEvaluator
                :object="object"
                :subject="subject"
        />
    </div>
</template>

<script lang="ts">
import TrainingGoals from "@/vue/guides/TrainingGoals";
import Vue from 'vue'
import Component from "vue-class-component";
import MatchupEvaluator from "@/vue/MatchupEvaluator.vue";
import heroes from 'data/heroes'
import HeroId from "data/HeroId";


@Component({
    components: {
        MatchupEvaluator,
        TrainingGoals,
    },
})
export default class TestingGround extends Vue {
    object = heroes.get(HeroId.Baptiste)
    subject = heroes.get(HeroId.Doomfist)
};

</script>

<style lang="scss" scoped>
.testing-ground {
    text-align: center;
}
</style>
