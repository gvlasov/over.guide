<template>
    <div class="part-spawner">
        <transition name="new-buttons-appear">
            <div
                    v-if="creating"
                    class="new-buttons"
                    v-bind:style="{order: where === 'beginning' ? 1 : 2}"
            >
                <OverwatchButton
                        type="default"
                >Add</OverwatchButton>
            </div>
        </transition>
        <div
                class="seed"
                v-bind:style="{order: where === 'beginning' ? 2 : 1}"
        >
            <transition
                    name="appear"
                    @after-enter="finishSpawn"
            >
                <GuidePart
                        v-if="creating"
                        :widget="incomingPart"
                        :index="where === 'beginning' ? 0 : parts.length-1"
                        :parts="parts"
                ></GuidePart>
            </transition>
            <div
                    v-if="!creating && showButtonsCurrent"
                    class="buttons-wrap"
            >
                <OverwatchButton
                        type="default"
                        class="button-add-text"
                        v-hammer:tap="createNewTextPart"
                        data-type="text"
                >text</OverwatchButton>
                <a
                        v-if="parts.length > 0"
                        class="close-button"
                        v-hammer:tap="() => showButtonsCurrent = false"
                >x</a>
                <OverwatchButton
                        type="default"
                        class="button-add-video"
                        data-type="video"
                        v-hammer:tap="createNewVideoPart"
                >video</OverwatchButton>
            </div>
        </div>
        <div v-if="!creating && !showButtonsCurrent">
            <OverwatchButton
                type="default"
                v-hammer:tap="() => showButtonsCurrent = true"
            >Add</OverwatchButton>
        </div>
    </div>
</template>

<script>
import OverwatchButton from "@/vue/OverwatchButton";
import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";
import GuidePartVideoWidget from "@/js/vso/GuidePartVideoWidget";
import GuidePart from "@/vue/guides/GuidePart";


export default {
    props: {
        parts: {
            type: Array,
            required: true,
        },
        where: {
            type: String,
            required: true,
        },
        showButtons: {
            type: Boolean,
            required: true,
        }
    },
    methods: {
        finishSpawn() {
            (
                (this.where === 'beginning')
                    ? this.parts.unshift
                    : this.parts.push
            )
                .apply(this.parts, [this.incomingPart]);
            this.incomingPart = undefined;
            this.creating = false;
            this.showButtonsCurrent = false;
        },
        createNewTextPart() {
            this.spawnPart(
                () => new GuidePartTextWidget(
                    {
                        kind: 'text',
                        contentMd: ''
                    },
                    true
                )
            );
        },
        createNewVideoPart() {
            this.spawnPart(
                () =>
                    new GuidePartVideoWidget(
                        {
                            kind: 'video',
                            excerpt: null,
                        },
                        true
                    )
            );
        },
        /**
         * @callback how
         */
        spawnPart(how) {
            this.creating = true;
            this.incomingPart = how()
        },
    },
    data() {
        return {
            emptyTextPart: new GuidePartTextWidget(
                {
                    kind: 'text',
                    contentMd: ''
                },
                true
            ),
            emptyVideoPart: new GuidePartVideoWidget(
                {
                    kind: 'video',
                    excerpt: null,
                },
                true
            ),
            incomingPart: undefined,
            creating: false,
            showButtonsCurrent: this.showButtons,
        }
    },
    watch: {
        showButtons(newValue) {
            this.showButtonsCurrent = newValue;
        },
    },
    computed: {},
    components: {
        GuidePart,
        OverwatchButton,
    },
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/tags.scss';

.part-spawner {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    align-items: stretch;
    padding: 0 0 0 0;

    .seed {
        @include overwatch-panel;
        flex: 0 0 100%;
    }

    .buttons-wrap {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        padding-bottom: 1rem;
        padding-top: 1rem;
        position: relative;

        .close-button {
            @include overwatch-futura;
            color: white;
            cursor: pointer;
            padding: 1rem;
        }

        .create-new-heading {
            font-size: 2em;
            color: white;
            @include overwatch-futura;
            flex-basis: 100%;
            position: absolute;
            top: 0;
        }

        button {
            flex-basis: 30%;
            font-size: 2.6em;
        }
    }

    .new-buttons {
        box-sizing: border-box;
        max-height: 20em;
        padding: 0 0 2rem 0;
        overflow: hidden;
        flex: 0 0 100%;
        z-index: 1;
    }

    .guide-part {
        background-color: transparent;
        overflow: hidden;
        box-shadow: none;
        max-height: 20rem;
        opacity: 1;
    }

    .new-buttons-appear-enter {
        max-height: 0;
        margin-bottom: 0;
        opacity: 0;
        padding: 0;
    }

    $animation-duration: .3s;
    $new-buttons-animation-duration: $animation-duration - .1s;

    .new-buttons-appear-enter-active {
        transition: max-height $new-buttons-animation-duration ease-in,
        margin-bottom $new-buttons-animation-duration ease-in,
        opacity $new-buttons-animation-duration ease-in,
        padding $new-buttons-animation-duration ease-in;
        transition-delay: .1s, .1s, .1s, .1s;
    }

    .appear-enter {
        max-height: 5em;
        height: 5em;
        opacity: 0;
    }

    .appear-enter-active {
        transition: max-height $animation-duration ease-in;
    }

}
</style>
