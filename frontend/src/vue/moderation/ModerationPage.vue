<template>
    <div class="root-content-sizer reports">
        <Report
                v-for="report in feed.unhandledReports"
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
import {InfiniteHandlerState} from "@/ts/InfiniteHandlerState";
import InfiniteLoading from "vue-infinite-loading";
import Report from "@/vue/moderation/Report.vue";
import WeakPanel from "@/vue/guides/WeakPanel.vue";
import ReportFeedVso from "@/ts/vso/ReportFeedVso";

@Component({
    components: {
        Report,
        InfiniteLoading,
        WeakPanel,
    },
})
export default class ModerationPage extends Vue {

    feed: ReportFeedVso = new ReportFeedVso()

    async infiniteHandler(state: InfiniteHandlerState) {
        await Backend.instance.searchReportsPaginated(
            this.feed.alreadyLoadedIds
        )
            .then(page => {
                this.feed.loadPage(page, state)
            })
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
