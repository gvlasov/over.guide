<template>
    <div class="training-goals">
        <div
                v-if="trainingGoals.length === 0"
                class="no-guides-notice"
        >
            Discover guides and add those you plan to master to your training goals
        </div>
        <template v-else>
            <TrainingGoal
                    v-for="trainingGoal in trainingGoals"
                    :key="trainingGoal.guide.guideId"
                    :training-goal="trainingGoal"
            />
        </template>
    </div>
</template>

<script>
    import Backend from "@/js/Backend";
    import axios from 'axios';
    import Guide from "@/vue/guides/Guide";
    import MyTrainingGoalsCache from "@/js/MyTrainingGoalsCache";
    import GuideVso from "@/js/vso/GuideVso";
    import TrainingGoalWidget from "@/js/vso/TrainingGoalWidget";
    import TrainingGoal from "@/vue/guides/TrainingGoal";

    const backend = new Backend(axios);
    export default {
        props: {},
        methods: {},
        data() {
            return {
                trainingGoals: [],
            };
        },
        async mounted() {
            this.trainingGoals =
                (await (new MyTrainingGoalsCache(backend)).loadGoals())
                    .map(dto =>
                        new TrainingGoalWidget(
                            new GuideVso(dto.guide),
                            dto.order,
                            false
                        )
                    );
        },
        components: {
            TrainingGoal,
            Guide,
        },
    };

</script>

<style lang="scss" scoped>
    @import '~@/assets/css/overwatch-ui.scss';

    .no-guides-notice {
        @include overwatch-futura;
        color: white;
    }

    .training-goals {
        display: inline-flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
        gap: 1em;
        width: 50em;
        max-width: min(50em, 100vw);
        min-width: min(50em, 100vw);

        & > * {
            flex-basis: 100%;
            max-width: min(50em, 100vw);
            min-width: min(50em, 100vw);
        }
    }
</style>
