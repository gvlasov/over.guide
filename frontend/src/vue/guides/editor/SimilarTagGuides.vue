<template>
    <div class="similar-tag-guides">
        <OverwatchDropdownButton
                :open="openDropdown"
                class="dropdown-toggle-button"
                v-hammer:tap="() => openDropdown = !openDropdown"
                :disabled="feed.items.length === 0"
        >{{ feed.items.length || 'no' }}{{ feed.touched && feed.hasNextPage ? '+' : '' }} similar guide{{ feed.items.length === 1 ? '' : 's' }}
        </OverwatchDropdownButton>
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
                        @close="() => {widget.open = false}"
                />
            </div>
            <InfiniteLoading
                    ref="infiniteLoading"
                    direction="bottom"
                    @infinite="(status) => feed.loadNextPage(status)"
                    class="infinite-loading"
                    force-use-infinite-wrapper
            >
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

@Component({
    components: {
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

    feed: GuideSearchFeedVso = new GuideSearchFeedVso(this.descriptor, false)

    openDropdown: boolean = false

    onOpen(widget: TrainingGoalWidget) {
        widget.open = true
    }

    guideWidgets: TrainingGoalWidget[] = []

    @Watch('descriptor', {deep: true})
    onDescriptorChange(newValue) {
        this.feed = new GuideSearchFeedVso(this.descriptor, false)
        this.feed.loadNextPage(this.infiniteLoading.stateChanger)
            .then(() => {
                this.guideWidgets =
                    this.feed.items.map(
                        (head, index) => new TrainingGoalWidget(head, index, false, false)
                    )
            })
    }

    mounted() {
        this.feed.loadNextPage(this.infiniteLoading.stateChanger)
        .then(() => {
            this.guideWidgets =
                this.feed.items.map(
                    (head, index) => new TrainingGoalWidget(head, index, false, false)
                )
        })
    }

}

</script>

<style lang="scss" scoped>
.similar-tag-guides {
    position: relative;

    .dropdown-toggle-button {
        text-align: center;
        background-color: #5f7589;
        width: 100%;
        position: sticky;
        top: 1em;
        z-index: 2;

        &:disabled {
            background-color: hsla(130, 80%, 45%, .7);

            & ::v-deep .background {
                box-shadow: none;
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
