<template>
    <div class="parts-list">
        <transition name="new-buttons-appear">
            <GuidePartSpawner
                    v-if="!beginningSpawnerHidden"
                    :where="ListPosition.Beginning"
                    :initial-seeding="entry.parts.length === 0"
                    @addVideo="createNewVideoPart"
                    @addText="createNewTextPart"
            />
        </transition>
        <transition-group
                class="guide-parts"
                name="appear"
                @before-enter="beforeEnter"
                :enter-to-class="enterToClass"
        >
            <GuidePart
                    v-for="(widget, index) in entry.parts"
                    :key="widget.id"
                    ref="guideParts"
                    :widget="widget"
                    :parts="entry.parts"
                    :index="index"
            />
        </transition-group>
        <transition name="new-buttons-appear">
            <GuidePartSpawner
                    v-if="endSpawnerEnabled"
                    :where="ListPosition.End"
                    :initial-seeding="false"
                    @addVideo="createNewVideoPart"
                    @addText="createNewTextPart"
            />
        </transition>
    </div>
</template>

<script lang="ts">
import GuidePart from "@/vue/guides/GuidePart";
import GuidePartSpawner from "@/vue/guides/editor/GuidePartSpawner";
import GuidePartTextWidget from "@/ts/vso/GuidePartTextWidget";
import GuidePartVideoWidget from "@/ts/vso/GuidePartVideoWidget";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import ListPosition from "@/ts/ListPosition";

@Component({
    components: {
        GuidePartSpawner,
        GuidePart,
    },
})
export default class GuideEditorPartsList extends Vue {
    ListPosition = ListPosition

    @Prop({required: true})
    entry: ExistingGuideHistoryEntryVso

    beginningSpawnerHidden: boolean = false
    endSpawnerHidden: boolean = false
    enterToClass: string = ''

    beforeEnter() {
        this.beginningSpawnerHidden = false;
        this.endSpawnerHidden = false
    }

    createNewTextPart(where: ListPosition) {
        this.spawnPart(
            () => new GuidePartTextWidget(
                {
                    kind: 'text',
                    contentMd: ''
                },
                true
            ),
            where
        );
    }

    createNewVideoPart(where) {
        this.spawnPart(
            () =>
                new GuidePartVideoWidget(
                    {
                        kind: 'video',
                        excerpt: {
                            youtubeVideoId: '',
                            startSeconds: 0,
                            endSeconds: 0,
                        },
                    },
                    true
                ),
            where
        );
    }

    spawnPart(how: () => GuidePartTextWidget | GuidePartVideoWidget, where: ListPosition) {
        this[`${where}SpawnerHidden`] = true;
        const widget = how();
        this.enterToClass = (widget.isText)
            ? 'appear-enter-to-text'
            : 'appear-enter-to-video';
        (
            (where === ListPosition.Beginning)
                ? this.entry.parts.unshift
                : this.entry.parts.push
        )
            .apply(this.entry.parts, [widget]);
    }

    get endSpawnerEnabled(): boolean {
        return this.entry.parts.length > 0 && !this.endSpawnerHidden;
    }
}

</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/common.scss';

.parts-list {
    .guide-parts {
        display: flex;
        flex-direction: column;
        gap: 2rem;

        .guide-part {

            &.appear-enter {
                max-height: 3em;
                overflow: hidden;
            }

            &.appear-enter-to-text {
                max-height: 24em;
                overflow: hidden;
            }

            &.appear-enter-to-video {
                max-height: 14em;
                overflow: hidden;
            }

            &.appear-enter-active {
                transition: max-height .2s ease-out,
                opacity .2s ease-out;
            }

            &.appear-leave {
                max-height: 24em;
                opacity: 1;
                overflow: hidden;
            }

            &.appear-leave-to {
                max-height: 0;
                opacity: 0;
                overflow: hidden;
            }

            &.appear-leave-active {
                transition: max-height .2s ease-out,
                opacity .2s ease-out;
            }

            &:first-child {
                margin-top: 2em;
            }
        }
    }

    .part-spawner {
        margin-top: 2rem;
        max-height: 15em;
        opacity: 1;

        $new-buttons-animation-duration: .2s;

        &.new-buttons-appear-enter {
            max-height: 0;
            margin-top: 0;
            opacity: 0;
            overflow: hidden;
        }

        &.new-buttons-appear-enter-to {
            overflow: hidden;
        }

        &.new-buttons-appear-enter-active {
            transition: max-height $new-buttons-animation-duration ease-out,
            margin-top $new-buttons-animation-duration ease-out;
            transition-delay: .05s, .05s;
        }
    }
}

</style>
