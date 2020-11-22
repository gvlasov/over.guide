<template>
    <div class="testing-ground">
        <Spinner
            />
    </div>
</template>

<script lang="ts">
import TrainingGoals from "@/vue/guides/TrainingGoals";
import Vue from 'vue'
import Component from "vue-class-component";
import Spinner from "@/vue/Spinner";
import RandomOppositionFeed from "@/ts/RandomOppositionFeed";


@Component({
    components: {
        Spinner,
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
    overflow: visible;
    background-color: hsla(0, 0%, 20%, .8);
    padding: 1em;
}
</style>
