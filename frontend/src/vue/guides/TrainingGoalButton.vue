<template>
    <div
            class="training-goal-button"
            v-bind:class="{added: added}"
    >
        <OverwatchButton
                type="default"
                v-hammer:tap="onTap"
                :disabled="!auth.loggedIn"
        >
            <font-awesome-icon icon="brain"/>
        </OverwatchButton>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import OverwatchButton from "@/vue/OverwatchButton.vue";
import Authentication from "@/ts/Authentication";
import MyTrainingGoalsCache from "@/ts/MyTrainingGoalsCache";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";

const myTrainingGoalsCache = MyTrainingGoalsCache.instance()

@Component({
    components: {OverwatchButton}
})
export default class Upvoter extends Vue {

    @Prop({required: true})
    entry: ExistingGuideHistoryEntryVso

    tappable: boolean = true

    auth: Authentication = Authentication.instance

    cache: MyTrainingGoalsCache = myTrainingGoalsCache

    onTap() {
        if (!this.tappable) {
            return
        }
        this.tappable = false
        if (!this.added) {
            this.$emit('remove')
            this.cache.addGoal(this.entry.guideId)
                .finally(() => {
                    this.tappable = true
                })
        } else {
            this.$emit('add')
            const hadItPending = this.cache.pendingGoalIds.includes(this.entry.guideId)
            this.cache.removeGoal(this.entry.guideId)
                .catch((e) => {
                    if (!hadItPending) {
                        this.$emit('loginRequired')
                    } else if (e.response.status === 422) {
                        this.$emit('upvoteRemoved')
                    }
                })
                .finally(() => {
                    this.tappable = true
                })
        }
    }

    get added(): boolean {
        return this.cache.goalIds.includes(this.entry.guideId) ||
            this.cache.pendingGoalIds.includes(this.entry.guideId);
    }

}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/tags.scss";

$body-size: 1.7em;

.training-goal-button {
    flex-shrink: 0;
    cursor: pointer;

    &.added button ::v-deep .background {
        background-color: rgba($overwatch-button-main-bg-color, 1) !important;
        opacity: .8;
    }

    &.added:hover button ::v-deep .background {
        background-color: rgba($overwatch-button-main-bg-color, 1) !important;
        opacity: 1;
    }

    button {
        font-size: 2em;
        @include overwatch-button;
        @include overwatch-futura;
        width: $body-size;
        height: $body-size;
        position: relative;
        border-radius: 50%;

        & ::v-deep .background {
            background-color: $overwatch-button-default-bg-color;
            border-radius: 50%;
        }

        &:hover ::v-deep .background {
            background-color: rgba($overwatch-button-default-bg-color, 1);
            opacity: 1;
        }

        & ::v-deep .content {
            padding: 0;
        }

        img {
            position: relative;
            height: .7em;
            top: -$body-size * .09;
            vertical-align: middle;
        }
    }

}
</style>
