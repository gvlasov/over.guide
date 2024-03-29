<template>
    <div class="similar-tag-guides">
        <StickyHoverer>
            <OverwatchDropdownButton
                    :open="openDropdown"
                    class="dropdown-toggle-button"
                    v-bind:class="{'dropdown-toggle-button-open': openDropdown}"
                    v-hammer:tap="() => openDropdown = !openDropdown"
                    :disabled="feed.items.length === 0"
            >{{ feed.items.length || 'no' }}{{ feed.touched && feed.hasNextPage ? '+' : '' }} similar guide{{ feed.items.length === 1 ? '' : 's' }}
            </OverwatchDropdownButton>
        </StickyHoverer>
        <div
                v-show="openDropdown"
                class="dropdown"
        >
            <div class="guides-list">
                <GuidePreviewBadge
                        v-for="(widget, index) in guideWidgets"
                        :head="widget.head"
                        :key="widget.head.entry.guideId"
                        :ghost="false"
                        :open="widget.open"
                        :order="index"
                        @open="() => onOpen(widget)"
                        @close="() => onClose(widget)"
                />
            </div>
            <InfiniteLoading
                    ref="infiniteLoading"
                    direction="bottom"
                    @infinite="(status) => feed.loadNextPage(status)"
                    class="infinite-loading"
                    force-use-infinite-wrapper
            >
                <SpinnerBlock slot="spinner"/>
                <span slot="no-more"></span>
                <span slot="no-results"></span>
            </InfiniteLoading>
        </div>
    </div>
</template>

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import GuidePreviewBadge from "@/vue/guides/GuidePreviewBadge";
import WeakPanel from "@/vue/guides/WeakPanel";
import TrainingGoalWidget from "@/ts/vso/TrainingGoalWidget";
import InfiniteLoading from "vue-infinite-loading";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton";
import OverwatchDropdownButton from "@/vue/OverwatchDropdownButton";
import {Prop, Ref, Watch} from "vue-property-decorator";
import Component from "vue-class-component";
import GuideSearchFeedVso from "@/ts/vso/GuideSearchFeedVso";
import Vue from 'vue'
import SpinnerBlock from "@/vue/SpinnerBlock.vue";
import StickyHoverer from "@/vue/StickyHoverer.vue";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";
import SimilarGuideSearchFeedVso from "@/ts/vso/SimilarGuideSearchFeedVso";

@Component({
    components: {
        StickyHoverer,
        SpinnerBlock,
        OverwatchDropdownButton,
        OverwatchPanelButton,
        GuidePreviewBadge,
        OverwatchButton,
        WeakPanel,
        InfiniteLoading,
    },
})
export default class SimilarTagGuides extends Vue {

    @Ref('infiniteLoading')
    infiniteLoading: InfiniteLoading

    @Prop({required: true})
    descriptor: GuideDescriptorVso

    @Prop({required: true})
    entry: ExistingGuideHistoryEntryVso|null

    feed: GuideSearchFeedVso =
        new SimilarGuideSearchFeedVso(
            this.descriptor,
            this.entry
        )

    openDropdown: boolean = false

    @Watch('openDropdown')
    onDropdownOpen(newValue: boolean) {
        if (!newValue) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        }
    }

    onOpen(widget: TrainingGoalWidget) {
        widget.open = true
        this.$forceUpdate()
    }

    onClose(widget: TrainingGoalWidget) {
        widget.open = false
        this.$forceUpdate()
    }


    get guideWidgets(): TrainingGoalWidget[] {
        return this.feed.items.map(
            (head, index) => new TrainingGoalWidget(head, index, false, false)
        )
    }

    @Watch('descriptor', {deep: true})
    onDescriptorChange(newValue: GuideDescriptorVso, oldValue: GuideDescriptorVso) {
        this.feed.descriptor = newValue
        this.feed.reset(this.infiniteLoading.stateChanger)
        this.feed.loadNextPage(this.infiniteLoading.stateChanger)
    }

    mounted() {
        this.feed.reset(this.infiniteLoading.stateChanger)
        this.feed.loadNextPage(this.infiniteLoading.stateChanger)
    }

}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/sticky-header.scss";
@import "~@/assets/css/overwatch-ui.scss";
.similar-tag-guides {
    position: relative;

    .sticky-hoverer {
        top: $sticky-header-height + 1rem;
        z-index: 2;
        display: block;
        .dropdown-toggle-button {
            text-align: center;
            background-color: $transparent-button-mount-bg-color;
            width: 100%;

            &:disabled {
                background-color: hsla(130, 80%, 45%, .7);

                & ::v-deep .background {
                    box-shadow: none;
                }
            }
        }
    }

    .dropdown {
        max-width: 100%;
        margin-top: .4em;
        overflow: visible;

        .guides-list {
            display: flex;
            flex-direction: column;
            gap: 1em;
            padding: .2em 0 .35em 0;
            overflow: visible;

            .guide-preview-badge {
                max-width: 100%;
                //& ::v-deep .collapsed .opacity {
                //    border-radius: 0;
                //}
                //& ::v-deep .collapsed {
                //    box-shadow: none;
                //}
            }
        }
    }

}
</style>
