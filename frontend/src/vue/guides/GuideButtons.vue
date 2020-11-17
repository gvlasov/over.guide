<template>
    <div class="guide-buttons">
        <NotificationModalPopup
                v-if="showMatchupRate"
                @close="() => showMatchupRate = false"
        >
            <SingleOppositionMatchupEvaluator
                    v-if="showMatchupRate"
                    :opposition="entry.descriptor.matchup"
                    @back="() => showMatchupRate = false"
            />
        </NotificationModalPopup>
        <LinkLikeButton
                v-if="entry.descriptor.matchup !== null"
                :disabled="!auth.loggedIn"
                v-hammer:tap="() => showMatchupRate = true"
        >rate matchup
        </LinkLikeButton>
        <LinkLikeButton
                :disabled="!auth.loggedIn"
                v-hammer:tap="() => creatingReport = !creatingReport"
        >report
        </LinkLikeButton>
        <NotificationModalPopup
                v-if="creatingReport"
                @close="() => creatingReport = false"
        >
            <ReportCreator
                    :post-id="entry.guideId"
                    :post-type-id="PostTypeId.Guide"
                    :post-type-name="'guide'"
                    :reasons="reasons"
                    @close="() => creatingReport = false"
            />
        </NotificationModalPopup>
        <LinkLikeButton
                v-if="canEdit"
                v-hammer:tap="edit"
        >Edit
        </LinkLikeButton>
        <LinkLikeButton
                v-if="canEdit"
                v-hammer:tap="() => deletingGuide = true"
        >Delete
        </LinkLikeButton>
        <NotificationModalPopup
                v-if="deletingGuide"
                @close="() => deletingGuide = false"
        >
            <div class="deletion-dialogue">
                <p>
                    Are you sure you want to delete this guide?<br/>This can't be undone.
                </p>
                <p>The guide will remain in training goals of users who have it added</p>
                <OverwatchButton
                        type="default"
                        v-hammer:tap="() => deletingGuide = false"
                >Back
                </OverwatchButton>
                <OverwatchButton
                        type="main"
                        v-hammer:tap="deactivate"
                >Delete
                </OverwatchButton>
            </div>
        </NotificationModalPopup>
    </div>
</template>

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import GuidePartText from "@/vue/guides/GuidePartText";
import Authentication from "@/ts/Authentication";
import Backend from "@/ts/Backend";
import GuideVideo from "@/vue/guides/GuideVideo";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import Vue from 'vue'
import GuideContent from "@/vue/guides/GuideContent.vue";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";
import ReportCreator from "@/vue/guides/ReportCreator.vue";
import PostTypeId from "data/PostTypeId";
import ReportReasonDto from "data/dto/ReportReasonDto";
import reportReasons from 'data/reportReasons'
import LinkLikeButton from "@/vue/general/LinkLikeButton.vue";
import NotificationModalPopup from "@/vue/general/NotificationModalPopup.vue";
import SingleOppositionMatchupEvaluator
    from "@/vue/evaluations/SingleOppositionMatchupEvaluator.vue";

const auth = new Authentication();

@Component({
    components: {
        SingleOppositionMatchupEvaluator,
        NotificationModalPopup,
        LinkLikeButton,
        ReportCreator,
        GuideContent,
        GuideVideo,
        GuidePartText,
        OverwatchButton,
    },
})
export default class GuideButtons extends Vue {

    PostTypeId = PostTypeId

    @Prop({required: true})
    entry: ExistingGuideHistoryEntryVso

    creatingReport: boolean = false

    deletingGuide: boolean = false

    showMatchupRate: boolean = false

    auth: Authentication = auth

    reasons: ReportReasonDto[] = Array.from(reportReasons.values())

    edit() {
        this.$router.push(`/guide-editor/${this.entry.guideId}`)
    }

    async deactivate(): Promise<void> {
        return Backend.instance
            .deactivateGuide(this.entry.guideId)
            .then(() => {
                this.$emit('guideDeactivated', this.entry.guideId)
            })
            .finally(() => {
                this.deletingGuide = false
                this.$router.push(`/user/${auth.userId}`)
            })
    }

    get canEdit(): boolean {
        return auth.canEditGuide(this.entry)
    }


};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.guide-buttons {
    border-bottom: 1px solid hsla(0, 0, 100%, .2);
    padding-top: .3em;
    padding-bottom: .3em;
    text-align: right;
    margin-bottom: 1rem;

    $training-goal-color: #edad4c;

    .remove-training-goal-button {

        @include overwatch-inline-button;

        & ::v-deep .background {
            background-color: $training-goal-color;
        }

        &:hover ::v-deep .background {
            background-color: $training-goal-color;
        }
    }

    & > button {
        padding-left: 1em;
        padding-right: 1em;
    }

}

.deletion-dialogue {
    font-size: 1.5em;
    padding: 1em;
    background-color: hsla(0, 0%, 20%, .95);
    @include overwatch-futura-no-smallcaps;
}

.matchup-evaluator {
    background-color: hsla(290, 20%, 29%, .95);
    padding: 1em;
    @media screen and (max-width: 35em) {
        padding: 1em 0;
    }
}

</style>
