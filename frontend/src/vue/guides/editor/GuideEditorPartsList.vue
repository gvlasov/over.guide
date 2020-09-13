<template>
    <div class="parts-list">
        <transition name="new-buttons-appear">
            <GuidePartSpawner
                    v-if="!beginningSpawnerHidden"
                    where="beginning"
                    :initial-seeding="guide.parts.length === 0"
                    @addVideo="createNewVideoPart"
                    @addText="createNewTextPart"
            />
        </transition>
        <transition-group
                class="guide-parts root-content-panel-wrap"
                name="appear"
                @before-enter="beforeEnter"
                :enter-to-class="enterToClass"
        >
            <GuidePart
                    v-for="(widget, index) in guide.parts"
                    :key="widget.id"
                    ref="guideParts"
                    :widget="widget"
                    :parts="guide.parts"
                    :index="index"
            />
        </transition-group>
        <transition name="new-buttons-appear">
            <GuidePartSpawner
                    v-if="endSpawnerEnabled"
                    where="end"
                    :initial-seeding="false"
                    @addVideo="createNewVideoPart"
                    @addText="createNewTextPart"
            />
        </transition>
    </div>
</template>

<script>
import GuidePart from "@/vue/guides/GuidePart";
import GuidePartSpawner from "@/vue/guides/editor/GuidePartSpawner";
import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";
import GuidePartVideoWidget from "@/js/vso/GuidePartVideoWidget";
import GuideVso from "@/js/vso/GuideVso";

export default {
    props: {
        guide: {
            type: GuideVso,
            required: true,
        },
    },
    methods: {
        beforeEnter() {
            this.beginningSpawnerHidden = false;
            this.endSpawnerHidden = false
        },
        createNewTextPart(where) {
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
        },
        createNewVideoPart(where) {
            this.spawnPart(
                () =>
                    new GuidePartVideoWidget(
                        {
                            kind: 'video',
                            excerpt: null,
                        },
                        true
                    ),
                where
            );
        },
        spawnPart(how, where) {
            this[where + 'SpawnerHidden'] = true;
            const widget = how();
            this.enterToClass = (widget.part.kind === 'text')
                ? 'appear-enter-to-text'
                : 'appear-enter-to-video';
            this.$nextTick(() => {
                (
                    (where === 'beginning')
                        ? this.guide.parts.unshift
                        : this.guide.parts.push
                )
                    .apply(this.guide.parts, [widget]);
            })
        },
    },
    data() {
        return {
            beginningSpawnerHidden: false,
            endSpawnerHidden: false,
            enterToClass: undefined,
        }
    },
    computed: {
        endSpawnerEnabled() {
            return this.guide.parts.length > 0 && !this.endSpawnerHidden;
        }
    },
    components: {
        GuidePartSpawner,
        GuidePart,
    },
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/common.scss';

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

</style>
