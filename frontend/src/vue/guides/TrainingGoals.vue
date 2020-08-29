<template>
    <div class="training-goals root-content-sizer">
        <div
                v-if="trainingGoals.length === 0"
                class="root-content-panel-wrap"
        >
            <WeakPanel
                    class="no-guides-notice"
            >
                <router-link to="/search">Discover guides</router-link> and add those you plan to master to your training goals
            </WeakPanel>
        </div>
        <template v-else>
            <draggable class="draggable" v-model="trainingGoals" draggable=".training-goal" :disabled="false">
                <TrainingGoal
                        class="training-goal root-content-sizer root-content-panel-wrap"
                        v-for="trainingGoal in trainingGoals"
                        :key="trainingGoal.guide.guideId + '-'+trainingGoal.order"
                        :training-goal="trainingGoal"
                        @removeUndo="onRemoveUndo"
                />
            </draggable>
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
import draggable from 'vuedraggable';
import WeakPanel from "@/vue/guides/WeakPanel";

const backend = new Backend(axios);
    export default {
        props: {},
        methods: {
            onRemoveUndo(guideId) {
                const guideIds = this.trainingGoals
                    .filter(it => !it.deleted)
                    .map(it => it.guide.guideId);
                (new MyTrainingGoalsCache(backend))
                    .addAndReorder(guideId, guideIds)
            },
        },
        data() {
            return {
                trainingGoals: [],
            };
        },
        async mounted() {
            this.trainingGoals =
                await (new MyTrainingGoalsCache(backend))
                    .loadGoals()
                    .then(goals =>
                        goals.map(dto =>
                            new TrainingGoalWidget(
                                new GuideVso(dto.guide),
                                dto.order,
                                false
                            )
                        )
                    )
        },
        watch: {
            trainingGoals(newValue, oldValue) {
                const newGuideIds = newValue
                    .filter(it => !it.deleted)
                    .map(it => it.guide.guideId);
                const oldGuideIds = oldValue
                    .filter(it => !it.deleted)
                    .map(it => it.guide.guideId);
                for (let index in this.trainingGoals) {
                    this.trainingGoals[index].order = this.trainingGoals.length - index - 1;
                }
                if (
                    newGuideIds.toString() !== oldGuideIds.toString()
                ) {
                    (new MyTrainingGoalsCache(backend)).saveGoalsOrder(newGuideIds)
                }
            },
        },
        components: {
            TrainingGoal,
            Guide,
            draggable,
            WeakPanel,
        },
    };

</script>

<style lang="scss" scoped>
    @import '~@/assets/css/overwatch-ui.scss';
    @import '~@/assets/css/common.scss';

    .no-guides-notice {
        @include overwatch-futura;
        color: white;
    }

    .training-goals {

        .draggable {
            display: inline-flex;
            flex-wrap: wrap;
            flex-direction: row;
            justify-content: center;
            gap: 1em;
        }

        & .training-goal {
            flex-basis: 100%;
        }

        padding-bottom: 10em;
    }
</style>
