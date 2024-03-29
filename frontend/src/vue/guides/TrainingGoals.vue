<template>
    <div class="training-goals root-content-sizer">
        <NotificationModalPopup
                v-if="!authenticated"
                @close="$router.go(-1)"
        >
            <LoginRequirement
                    @back="$router.go(-1)"
            >
                <template v-slot:notice>Log in to view your training goals</template>
            </LoginRequirement>
        </NotificationModalPopup>
        <div
                v-if="synchronizing"
                class="synchronization"
        >
            Synchronizing
            <div>{{ deliveredCount }}</div>
        </div>
        <WeakPanel
                v-else-if="trainingGoals.length === 0"
                class="no-guides-notice"
        >
            <font-awesome-icon icon="bookmark"/> <router-link to="/search">Discover guides</router-link>
            and add  those you plan to master to your training goals
        </WeakPanel>
        <template v-else>
            <draggable class="draggable" v-model="trainingGoals" draggable=".training-goal" :disabled="isAnyOpen">
                <TrainingGoal
                        class="training-goal root-content-sizer"
                        v-for="trainingGoal in trainingGoals"
                        :key="trainingGoal.head.entry.guideId + '-'+trainingGoal.order"
                        :training-goal="trainingGoal"
                        @removeUndo="onRemoveUndo"
                        @open="() => openOnly(trainingGoal)"
                        @close="closeAll"
                />
            </draggable>
        </template>
        <div class="a2hs">
            <InstallPwaButton/>
        </div>
    </div>
</template>

<script lang="ts">
import Backend from "@/ts/Backend";
import axios from 'axios';
import Guide from "@/vue/guides/Guide";
import MyTrainingGoalsCache from "@/ts/MyTrainingGoalsCache";
import TrainingGoalWidget from "@/ts/vso/TrainingGoalWidget";
import TrainingGoal from "@/vue/guides/TrainingGoal";
import draggable from 'vuedraggable';
import WeakPanel from "@/vue/guides/WeakPanel";
import Authentication from "@/ts/Authentication";
import LoginRequirement from "@/vue/LoginRequirement";
import TestingGround from "@/vue/TestingGround";
import Vue from 'vue'
import {Watch} from "vue-property-decorator";
import Component from "vue-class-component";
import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import ModalPopup from "@/vue/general/ModalPopup.vue";
import NotificationModalPopup from "@/vue/general/NotificationModalPopup.vue";
import InstallPwaButton from "@/vue/InstallPwaButton.vue";

const backend = new Backend(axios);
const auth = new Authentication()
@Component({
    components: {
        InstallPwaButton,
        NotificationModalPopup,
        ModalPopup,
        TestingGround,
        LoginRequirement,
        TrainingGoal,
        Guide,
        draggable,
        WeakPanel,
    },
})
export default class TrainingGoals extends Vue {

    trainingGoals: TrainingGoalWidget[] = []
    cache: MyTrainingGoalsCache = MyTrainingGoalsCache.instance()
    deliveredCount: number = 0
    authenticated: boolean = auth.authenticated
    draggable: boolean = true

    onRemoveUndo(guideId) {
        const guideIds = this.trainingGoals
            .filter(it => !it.deleted)
            .map(it => it.head.entry.guideId);
        MyTrainingGoalsCache.instance()
            .addAndReorder(guideId, guideIds)
    }

    openOnly(goal) {
        this.closeAll()
        goal.open = true;
    }

    closeAll() {
        this.trainingGoals.forEach(g => {
            g.open = false
        })
    }

    get synchronizing(): boolean {
        return auth.authenticated && this.cache.pendingGoalIds.length > 0;
    }

    get isAnyOpen(): boolean {
        return !!this.trainingGoals.find(g => g.open);
    }

    async created() {
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
                                    new ExistingGuideHeadVso(dto),
                                    dto.order,
                                    false
                                )
                            )
                        )
                )
    }

    @Watch('trainingGoals')
    onTrainingGoalsChange(
        newValue: TrainingGoalWidget[],
        oldValue: TrainingGoalWidget[]
    ) {
        const newGuideIds = newValue
            .filter(it => !it.deleted)
            .map(it => it.head.entry.guideId);
        const oldGuideIds = oldValue
            .filter(it => !it.deleted)
            .map(it => it.head.entry.guideId);
        for (let index in this.trainingGoals) {
            this.trainingGoals[index].order = this.trainingGoals.length - index - 1;
        }
        if (
            newGuideIds.toString() !== oldGuideIds.toString()
        ) {
            MyTrainingGoalsCache.instance().saveGoalsOrder(newGuideIds)
        }
    }
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/common.scss';

.no-guides-notice {
    @include overwatch-futura;
    svg {
        position: relative;
        top: .1em;
        font-size: .9em;
        margin-right: .5em;
    }
}

.training-goals {

    .draggable {
        display: inline-flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
        gap: 1em;
        max-width: 100%;
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
.a2hs {
    margin-top: 3em;
    margin-bottom: 3em;
}
</style>
