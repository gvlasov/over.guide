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
                @infinite="(state) => feed.loadNextPage(state)"
                force-use-infinite-wrapper
        >
            <SpinnerBlock slot="spinner"/>
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
import Vue from 'vue'
import Component from "vue-class-component";
import InfiniteLoading from "vue-infinite-loading";
import Report from "@/vue/moderation/Report.vue";
import WeakPanel from "@/vue/guides/WeakPanel.vue";
import ReportFeedVso from "@/ts/vso/ReportFeedVso";
import {Ref} from "vue-property-decorator";
import SpinnerBlock from "@/vue/SpinnerBlock.vue";

@Component({
    components: {
        SpinnerBlock,
        Report,
        InfiniteLoading,
        WeakPanel,
    },
})
export default class ModerationPage extends Vue {
    @Ref('infiniteLoading')
    infiniteLoading: InfiniteLoading

    feed: ReportFeedVso = new ReportFeedVso()

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
