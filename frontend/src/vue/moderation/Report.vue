<template>
    <OverwatchPanel class="report">
        <div class="reporter">
            <UserLink
                    :user="report.reporter"
                    class="reporter-name"
            />
            reported this for
            <div class="report-reason">
                {{ reportReasons.get(report.reportReasonId).name }}
            </div>
            <RelativeTime
                    :time="report.createdAt"
            />
        </div>
        <div class="abuse-content">
            <Guide
                    v-if="report.post instanceof ExistingGuideHeadVso"
                    :head="report.post"
            />
            <Comment
                    v-else
                    :comment="report.post"
                    :post="report.post.strayPost"
            />
        </div>
        <SentenceConstructor
                :object-id="report.postId"
                :restriction-types="posterRestrictionTypes"
                :immediate-action-types="posterImmediateActionTypes"
                :defender="report.defendant"
                @created="onSentenceCreated"
        >
            Punish poster
            <UserLink :user="report.defendant"/>
        </SentenceConstructor>
        <SentenceConstructor
                :object-id="report.postId"
                :restriction-types="[restrictionTypes.get(RestrictionTypeId.ReportingBan)]"
                :immediate-action-types="[immediateActionTypes.get(ImmediateActionTypeId.IgnoreAllCurrentReports)]"
                :defender="report.reporter"
                @created="onSentenceCreated"
        >
            Punish reporter
            <UserLink :user="report.reporter"/>
        </SentenceConstructor>
        <div class="accusation-info">
            <h3>Browse</h3>
            <h4>Poster
                <UserLink :user="report.defendant"/>
            </h4>
            <ul>
                <li>Offences</li>
                <li>Reports</li>
            </ul>
            <h4>Reporter
                <UserLink :user="report.reporter"/>
            </h4>
            <ul>
                <li>Offences</li>
                <li>Reports</li>
            </ul>
        </div>
    </OverwatchPanel>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import reportReasons from 'data/reportReasons'
import PostTypeId from "data/PostTypeId";
import Guide from "@/vue/guides/Guide.vue";
import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import Comment from "@/vue/comments/Comment.vue";
import LinkLikeButton from "@/vue/general/LinkLikeButton.vue";
import UserLink from "@/vue/guides/UserLink.vue";
import {Prop} from "vue-property-decorator";
import RelativeTime from "@/vue/guides/RelativeTime.vue";
import SentenceConstructor from "@/vue/moderation/SentenceConstructor.vue";
import ReportReadVso from "@/ts/vso/ReportReadVso";
import immediateActionTypes from 'data/immediateActionTypes'
import ImmediateActionTypeId from "data/ImmediateActionTypeId";
import restrictionTypes from 'data/restrictionTypes'
import RestrictionTypeId from "data/RestrictionTypeId";
import RestrictionTypeDto from "data/dto/RestrictionTypeDto";
import Backend from "@/ts/Backend";
import OverwatchPanel from "@/vue/general/OverwatchPanel.vue";

@Component({
    components: {
        OverwatchPanel,
        SentenceConstructor,
        RelativeTime,
        UserLink,
        LinkLikeButton,
        Comment,
        Guide,
    },
})
export default class Report extends Vue {

    ImmediateActionTypeId = ImmediateActionTypeId

    RestrictionTypeId = RestrictionTypeId

    immediateActionTypes = immediateActionTypes

    restrictionTypes = restrictionTypes

    @Prop({required: true})
    report: ReportReadVso

    ExistingGuideHeadVso = ExistingGuideHeadVso

    PostTypeId = PostTypeId

    reportReasons = reportReasons

    get posterRestrictionTypes(): RestrictionTypeDto[] {
        return Array.from(this.restrictionTypes.values()).filter(
            type => this.report.canApply(type)
        )
    }

    get posterImmediateActionTypes(): RestrictionTypeDto[] {
        return Array.from(this.immediateActionTypes.values()).filter(
            type => this.report.canApply(type)
        )
    }

    onSentenceCreated() {
        Backend.instance
            .handleReport(this.report.id)
            .then(() => {
                this.report.handled = true
            })
    }


}

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';
@import '~@/assets/css/overwatch-ui.scss';

.report {
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
    padding: 1em;

    & > div {
        flex-basis: 100%;
        text-align: left;
    }

    .abuse-content {
        .guide {
            background-color: transparent;
            box-shadow: none;
            padding: 0;
        }
    }

    .reporter {
        border-bottom: 1px solid hsla(0, 0, 100%, 0.2);
        padding-bottom: 1em;
        text-align: left;

        .reporter-name, .report-reason {
            display: inline-block;
        }

        .report-reason {
            font-weight: bold;
            text-shadow: 1px 1px 0 black;
        }
    }

    .action-buttons {
        border-top: 1px solid hsla(0, 0, 100%, 0.2);
        text-align: left;
        padding: 0 1em 1em 1em;

        input[type=number] {
            width: 4em;
        }
    }

    .sentence-constructor {
        border-top: 1px solid hsla(0, 0, 100%, 0.2);
    }

    .accusation-info {
        border-top: 1px solid hsla(0, 0, 100%, 0.2);
    }
}
</style>
