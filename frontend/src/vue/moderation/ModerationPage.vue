<template>
    <div class="root-content-sizer reports">
        <Report
                v-for="report in unhandledReports"
                :key="report.postId+'-'+report.postTypeId+'-'+report.reportReasonId+'-'+report.reporter.id"
                :report="report"
        />
        <InfiniteLoading
                ref="infiniteLoading"
                direction="bottom"
                @infinite="infiniteHandler"
                force-use-infinite-wrapper
        >

            <WeakPanel slot="no-results">
                All clear!
            </WeakPanel>
            <WeakPanel slot="no-more">
                No more reports
            </WeakPanel>
        </InfiniteLoading>
    </div>
</template>

<script lang="ts">
import Backend from "@/ts/Backend";
import Vue from 'vue'
import Component from "vue-class-component";
import ReportReadVso from "@/ts/vso/ReportReadVso";
import {InfiniteHandlerState} from "@/ts/InfiniteHandlerState";
import InfiniteLoading from "vue-infinite-loading";
import Guide from "@/vue/guides/Guide.vue";
import Comment from "@/vue/comments/Comment.vue";
import LinkLikeButton from "@/vue/general/LinkLikeButton.vue";
import UserLink from "@/vue/guides/UserLink.vue";
import Report from "@/vue/moderation/Report.vue";
import WeakPanel from "@/vue/guides/WeakPanel.vue";

@Component({
    components: {
        Report,
        UserLink,
        LinkLikeButton,
        Comment,
        Guide,
        InfiniteLoading,
        WeakPanel,
    },
})
export default class ModerationPage extends Vue {

    alreadyLoadedReportIds: number[] = []

    hasNextPage: boolean | null = null

    reports: ReportReadVso[] = []

    async infiniteHandler($state: InfiniteHandlerState) {
        await Backend.instance.searchReportsPaginated(
            this.alreadyLoadedReportIds
        )
            .then(page => {
                this.reports.push(...page.reports.map(dto => new ReportReadVso(dto)));
                this.alreadyLoadedReportIds.push(...page.reports.map(dto => dto.id as number))
                if (this.reports.length > 0) {
                    $state.loaded()
                }
                if (!page.hasNextPage) {
                    $state.complete()
                }
                this.hasNextPage = page.hasNextPage
            })
    }

    get unhandledReports(): ReportReadVso[] {
        return this.reports.filter(report => !report.handled)
    }

    resetInfiniteLoading() {
        this.reports = [];
        this.alreadyLoadedReportIds = [];
        if (this.$refs.infiniteLoading) {
            (this.$refs.infiniteLoading as any).stateChanger.reset();
        }
        this.hasNextPage = null;
    }
}

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';
@import '~@/assets/css/overwatch-ui.scss';

.reports {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 2em;
}
</style>
