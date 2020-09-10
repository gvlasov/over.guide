<template>
    <div class="training-goals root-content-sizer">
        <LoginRequirement
                v-if="!authenticated"
        >
            <template v-slot:notice>Log in to view your training goals</template>
        </LoginRequirement>
        <div
                v-if="synchronizing"
                class="synchronization"
        >
            Synchronizing
            <div>{{ deliveredCount }}</div>
        </div>
        <div
                v-else-if="trainingGoals.length === 0"
                class="root-content-panel-wrap"
        >
            <WeakPanel
                    class="no-guides-notice"
            >
                <router-link to="/search">Discover guides</router-link> and add those you plan to master to your training goals
            </WeakPanel>
        </div>
        <template v-else>
            <draggable class="draggable" v-model="trainingGoals" draggable=".training-goal" :disabled="isAnyOpen">
                <TrainingGoal
                        class="training-goal root-content-sizer root-content-panel-wrap"
                        v-for="trainingGoal in trainingGoals"
                        :key="trainingGoal.guide.guideId + '-'+trainingGoal.order"
                        :training-goal="trainingGoal"
                        @removeUndo="onRemoveUndo"
                        @open="() => openOnly(trainingGoal)"
                        @close="closeAll"
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
import Authentication from "@/js/Authentication";
import LoginRequirement from "@/vue/LoginRequirement";
import TestingGround from "@/vue/TestingGround";

const backend = new Backend(axios);
const auth = new Authentication()
    export default {
        props: {},
        methods: {
            onRemoveUndo(guideId) {
                const guideIds = this.trainingGoals
                    .filter(it => !it.deleted)
                    .map(it => it.guide.guideId);
                MyTrainingGoalsCache.instance()
                    .addAndReorder(guideId, guideIds)
            },
            openOnly(goal) {
                this.closeAll()
                goal.open = true;
            },
            closeAll() {
                this.trainingGoals.forEach(g => {g.open = false})
            }
        },
        data() {
            return {
                trainingGoals: [],
                cache: MyTrainingGoalsCache.instance(),
                deliveredCount: 0,
                authenticated: auth.authenticated,
                draggable: true,
            };
        },
        computed: {
            synchronizing() {
                return auth.authenticated && this.cache.pendingGoalIds.length > 0;
            },
            isAnyOpen() {
                return !!this.trainingGoals.find(g => g.open);
            }
        },
        async mounted() {
            this.trainingGoals =
                await this.cache.deliverPending(() => {
                    this.deliveredCount++;
                })
                    .then(() =>
                        MyTrainingGoalsCache.instance()
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
                    MyTrainingGoalsCache.instance().saveGoalsOrder(newGuideIds)
                }
            },
        },
        components: {
            TestingGround,
            LoginRequirement,
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
    }

    .training-goals {

        .draggable {
            display: inline-flex;
            flex-wrap: wrap;
            flex-direction: row;
            justify-content: center;
            gap: 1em;
        }
        .sortable-ghost {
            visibility: hidden;
        }

        & .training-goal {
            flex-basis: 100%;
        }

        padding-bottom: 10em;
    }
    .synchronization {
        font-family: BigNoodleTooOblique, sans-serif;
        font-size: 4em;
    }
</style>
