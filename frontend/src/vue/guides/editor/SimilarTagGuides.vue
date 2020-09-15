<template>
    <div class="similar-tag-guides">
        <OverwatchDropdownButton
                :open="openDropdown"
                class="dropdown-toggle-button"
                v-hammer:tap="() => openDropdown = !openDropdown"
                :disabled="guides.length === 0"
        >{{ guides.length || 'no' }}{{ hasNextPage ? '+' : '' }} similar guide{{ guides.length === 1 ? '' : 's' }}
        </OverwatchDropdownButton>
        <div
                v-if="openDropdown"
                class="dropdown"
        >
            <div class="guides-list">
                <GuidePreviewBadge
                        v-for="(widget, index) in guideWidgets"
                        :guide="widget.guide"
                        :key="widget.guide.guideId"
                        :ghost="false"
                        :open="widget.open"
                        :order="index"
                        @open="() => {widget.open = true}"
                        @close="() => {widget.open = false}"
                />
            </div>
            <InfiniteLoading
                    ref="infiniteLoading"
                    direction="bottom"
                    @infinite="infiniteHandler"
                    class="infinite-loading"
                    force-use-infinite-wrapper
            >
                <span slot="no-more"></span>
                <span slot="no-results"></span>
            </InfiniteLoading>
        </div>
    </div>
</template>

<script>
import OverwatchButton from "@/vue/OverwatchButton";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import GuidePreviewBadge from "@/vue/guides/GuidePreviewBadge";
import WeakPanel from "@/vue/guides/WeakPanel";
import InfiniteGuideSearchMixin
    from "@/vue/guides/editor/InfiniteGuideSearchMixin";
import TrainingGoalWidget from "@/js/vso/TrainingGoalWidget";
import InfiniteLoading from "vue-infinite-loading";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton";
import OverwatchDropdownButton from "@/vue/OverwatchDropdownButton";

export default {
    mixins: [
        InfiniteGuideSearchMixin,
    ],
    props: {
        descriptor: {
            type: GuideDescriptorVso,
            required: true,
        },
    },
    methods: {
        initialLoadGuides() {
            this.resetInfiniteLoading()
            this.infiniteHandler({
                loaded() {},
                complete() {},
            })
        }
    },
    watch: {
        descriptor: {
            deep: true,
            handler() {
                this.initialLoadGuides()
            },
        },
        guides(newValue) {
            this.guideWidgets = newValue.map(
                (guide, index) => new TrainingGoalWidget(guide, index, false, false)
            )
        }
    },
    data() {
        return {
            openDropdown: false,
            exact: false,
            guideWidgets: [],
        }
    },
    components: {
        OverwatchDropdownButton,
        OverwatchPanelButton,
        GuidePreviewBadge,
        OverwatchButton,
        WeakPanel,
        InfiniteLoading,
    },
};

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
        overflow: auto;
        margin-top: .4em;
        .guides-list {
            display: flex;
            flex-direction: column;
            gap: 1em;
            padding: .2em .4em .35em .4em;

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

.infinite-loading {
    .no-results {

    }
}
</style>
