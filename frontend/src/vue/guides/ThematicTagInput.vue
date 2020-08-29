<template>
    <tags-input
            :typeahead="true"
            :existing-tags="existingTags"
            :typeahead-hide-discard="true"
            :only-existing-tags="true"
            :typeahead-activation-threshold="0"
            :placeholder="placeholder"
            class="root"
            v-model="descriptor.individualTags"
            :sort-search-results="false"
            @tags-updated="onTagsUpdated"
            :case-sensitive-tags="false"
    >
        <template v-slot:selected-tag="{tag, index, removeTag}">
            <ThematicTagBadge
                    :tag="tag"
                    v-hammer:tap="() => removeTag(index)"
            />
        </template>
    </tags-input>
</template>

<script>
import VoerroTagsInput from '@voerro/vue-tagsinput';
import Tag from "@/vue/guides/tags/hero/Tag";
import SeededShuffler from "@/js/SeededShuffler";
import GuideTheme from "data/GuideTheme";
import ThematicTagVso from "@/js/vso/ThematicTagVso";
import MapTagVso from "@/js/vso/MapTagVso";
import thematicTags from "data/thematicTags";
import maps from 'data/maps'
import ThematicTagBadge from "@/vue/guides/tags/ThematicTagBadge";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";

export default {
        name: "ThematicTagInput",
        props: {
            descriptor: {
                type: GuideDescriptorVso,
                required: true,
            }
        },
        data() {
            return {
                existingTags: this.getExistingTags(),
            };
        },
        computed: {
            /**
             * @return {string}
             */
            placeholder() {
                if (
                    this.descriptor.individualTags.length === 0
                ) {
                    const shuffler = new SeededShuffler(new Date().toLocaleString());
                    return shuffler
                        .shuffle(
                            Object.values(GuideTheme)
                                .filter(it => typeof it !== 'number')
                        )
                        .slice(0, 3)
                        .concat(
                            shuffler
                                .shuffle(
                                    Array.from(maps.values())
                                )
                                .slice(0, 3)
                                .map(map => map.name)
                        )
                        .join(', ') + '...';
                } else {
                    return '';
                }
            },
        },
        methods: {
            getExistingTags() {
                return (
                    Array.from(thematicTags.values())
                        .map(theme => new ThematicTagVso(theme))
                        .concat(
                            Array.from(maps.values())
                                .map(map => new MapTagVso(map))
                        )
                )
            },
            onTagsUpdated($event) {
                this.$emit('tagChange');
            },
        },
        components: {
            Tag,
            'tags-input': VoerroTagsInput,
            ThematicTagBadge,
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/assets/css/fonts.css";
    @import "~@voerro/vue-tagsinput/dist/style.css";
    @import "~@/assets/css/tags.scss";
    @import "~@/assets/css/overwatch-ui.scss";

    .root ::v-deep .tags-input-badge {
        padding: 0;
        margin: 0;
        font-size: 1.3em;
        border-radius: 0;
        background-color: transparent;
        line-height: 1em;
        cursor: pointer;
    }

    .root ::v-deep .tags-input {
        & > .tags-input-badge:hover {
            opacity: .3;
        }

        span {
            margin: 0;
        }
    }

    ::v-deep .theme > *, ::v-deep .typeahead-badges .theme {
        @include tag-bg-theme;
    }

    ::v-deep .map > *, ::v-deep .typeahead-badges .map {
        @include tag-bg-map;
    }

    .root ::v-deep .typeahead-badges {
        display: flex;
        gap: .2em;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: .3em;
        box-sizing: border-box;
        max-height: 10em;
        max-width: 100%;
        min-width: 100%;
        overflow-y: auto;
        position: absolute;
        background-color: white;
        border-radius: .25em;
        border-color: #dbdbdb;
        margin-top: 0;
        border-top: 0;
        border-left: 0;
        border-right: 0;
        z-index: 2;
        overscroll-behavior: none contain;
    }

    .root ::v-deep .typeahead-badges > .tags-input-typeahead-item-default,
    .root ::v-deep .typeahead-badges > .tags-input-typeahead-item-highlighted-default {
        font-size: 1.5em;
        padding: .18em .3em .3em .3em;
        border-radius: .2em;
        @include overwatch-futura;
        text-transform: lowercase;
        font-weight: normal;
        color: white;
        text-shadow: 0 0 .06em black;
        box-shadow: 0 0 .06em black;
    }

    .root ::v-deep .tags-input-wrapper-default {
        background: none;
        border: none;
        box-shadow: none;
        position: relative;
        padding: 0 .5rem 0 .5rem;
        height: 100%;

        input[type=text] {
            font-family: "Proxima Nova Light", sans-serif;
            font-weight: bold;
        }
    }

    .root ::v-deep .tags-input input[type=text] {
        display: inline-block;
        width: 2em;
        padding-right: .5em;
        height: 3em;
    }

    .root {
    }

</style>