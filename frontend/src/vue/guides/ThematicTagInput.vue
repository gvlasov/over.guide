<template>
    <tags-input
            :typeahead="true"
            :existing-tags="existingTags"
            :typeahead-hide-discard="true"
            :only-existing-tags="true"
            :typeahead-activation-threshold="0"
            :placeholder="placeholder"
            class="root"
            v-model="localSelectedTags"
            :sort-search-results="false"
            @tags-updated="onTagsUpdated"
    >
        <template v-slot:tag="{tag, index, removeTag}">
            <div
                    v-bind:class="tag.type"
                    class="tag-custom-badge"
                    @click.prevent="removeTag(index)"
            >
                <span v-html="tag.value"></span>
                <span
                        class="tags-input-remove"
                ><img src="/icons/clear-selection.svg"></span>
            </div>
        </template>
    </tags-input>
</template>

<script>
    import VoerroTagsInput from '@voerro/vue-tagsinput';
    import Tag from "@/vue/guides/tags/hero/Tag";
    import SeededShuffler from "@/js/SeededShuffler";
    import Map from "data/Map";
    import GuideTheme from "data/GuideTheme";

    export default {
        model: {
            prop: 'selectedTags',
            event: 'tagSelectionChange',
        },
        name: "ThematicTagInput",
        props: {
            selectedTags: {
                type: Array,
                required: true,
            }
        },
        data() {
            return {
                existingTags: this.getExistingTags(),
            };
        },
        computed: {
            localSelectedTags: {
                get() {
                    return this.selectedTags;
                },
                set(tags) {
                    this.$emit('tagSelectionChange', tags);
                },
            },
            /**
             * @return {string}
             */
            placeholder() {
                if (this.selectedTags.length === 0) {
                    const shuffler = new SeededShuffler('asdf');
                    return shuffler
                        .shuffle(
                            Object.values(GuideTheme)
                                .filter(it => typeof it !== 'number')
                        )
                        .slice(0, 3)
                        .concat(
                            shuffler
                                .shuffle(
                                    Object.values(Map)
                                        .filter(it => typeof it !== 'number')
                                )
                                .slice(0, 3)
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
                    Object.values(GuideTheme)
                        .filter(it => typeof it !== 'number')
                        .map(
                            value => {
                                return {
                                    key: value.toLowerCase().replace(/\s+/, '-'),
                                    value: value,
                                    class: 'theme',
                                };
                            }
                        )
                        .concat(
                            Object.values(Map)
                                .filter(it => typeof it !== 'number')
                                .map(
                                    value => {
                                        return {
                                            key: value.toLowerCase().replace(/\s+/, '-'),
                                            value: value,
                                            class: 'map',
                                        };
                                    }
                                )
                        )
                )
            },
            onTagsUpdated($event) {
                this.$emit('tagSelectionChange', this.selectedTags);
            },
        },
        components: {
            Tag,
            'tags-input': VoerroTagsInput,
        }
    }
</script>

<style scoped>
    @import "~@/assets/css/fonts.css";
    @import "~@voerro/vue-tagsinput/dist/style.css";

    .root >>> .tags-input-badge {
        font-family: 'Futura Demi Bold', sans-serif;
        font-variant: all-small-caps;
        padding: 0;
        font-size: 1.3em;
        border-radius: .3em;
        height: 100%;
        margin: 0 .2em .2em 0;
        vertical-align: middle !important;
    }

    .root >>> .tags-input-remove {
        display: none;
        cursor: pointer;
        position: static;
        right: auto;
        top: auto;
        padding: 0;
        overflow: hidden;
        vertical-align: top;
        height: 100%;
    }

    .root >>> .tags-input-remove > img {
        width: 0.5em;
        height: 0.5em;
    }

    .root >>> .tags-input > .tags-input-badge:hover {
        opacity: .3;
    }

    .root >>> .tags-input-remove:before, .root >>> .tags-input-remove:after {
        content: none;
    }

    .theme {
        background-color: #9fbed7 !important;
    }

    .map {
        background-color: #d4a1bb !important;
    }

    .tag-custom-badge {
        padding: .3em;
        cursor: pointer;
    }

    .root >>> .typeahead-badges {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: .3em;
        box-sizing: border-box;
        max-height: 10em;
        overflow-y: auto;
        max-width: 30em;
        min-width: 30em;
        position: absolute;
        background-color: white;
        border: 1px solid transparent;
        border-radius: .25em;
        border-color: #dbdbdb;
        margin-top: 0;
        border-top: 0;
        border-left: 0;
        border-right: 0;
    }

    .root >>> .typeahead-badges > .tags-input-typeahead-item-default,
    .root >>> .typeahead-badges > .tags-input-typeahead-item-highlighted-default {
        font-size: 1.5em;
        padding: .3em;
        border-radius: .2em;
        font-family: 'Futura Demi Bold', sans-serif;
        font-variant: all-small-caps;
        color: #32323b;
        margin: 0 .2em .2em 0;
    }

    .root >>> .tags-input-wrapper-default {
        background: none;
        border: none;
        box-shadow: none;
        position: relative;
        padding: .5em .25em .3em .25em;
        height: 100%;
    }

    .root >>> .tags-input input[type=text] {
        display: inline-block;
        width: 2em;
    }

    .root >>> .tags-input-badge.map {
        background-color: #b0d4a1 !important;
    }

    .root >>> .tags-input-badge.theme {
        background-color: #fedd8b !important;
    }

    .root {
        max-width: 30em;
        width: 30em;
    }

</style>