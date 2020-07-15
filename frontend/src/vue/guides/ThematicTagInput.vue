<template>
    <tags-input
            v-model="selectedTags"
            :typeahead="true"
            :existing-tags="existingTags"
            :typeahead-hide-discard="true"
            :only-existing-tags="true"
            :typeahead-activation-threshold="0"
            :placeholder="placeholder"
            class="root"
            :sort-search-results="false"
    >
        <template v-slot:tag="{tag, index, removeTag}">
            <div v-bind:class="tag.type" class="tag-custom-badge">
                <span v-html="tag.value"></span>
                <span
                        class="tags-input-remove"
                        @click.prevent="removeTag(index)">x</span>
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
        name: "ThematicTagInput",
        props: {},
        data() {
            return {
                selectedTags: [],
                existingTags: this.getExistingTags(),
            };
        },
        computed: {
            /**
             * @return {string}
             */
            placeholder() {
                if (this.selectedTags.length === 0) {
                    return new SeededShuffler('asdf')
                        .shuffle(this.getExistingTags())
                        .map(it => it.value)
                        .slice(0, 6)
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
                                    type: 'theme',
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
                                            type: 'map',
                                        };
                                    }
                                )
                        )
                )
            }
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
        padding: 0;
        font-size: 1.3em;
        border-radius: .3em;
        height: 100%;
    }

    .root >>> .tags-input-remove {
        cursor: pointer;
        position: static;
        display: inline-block;
        right: auto;
        top: auto;
        padding: 0;
        overflow: hidden;
        vertical-align: top;
        height: 100%;
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
    }

    .root >>> .typeahead-badges > .tags-input-typeahead-item-default,
    .root >>> .typeahead-badges > .tags-input-typeahead-item-highlighted-default {
        font-size: 2em;
        padding: .3em;
        border-radius: .2em;
        font-family: 'Koverwatch', sans-serif;
        color: #32323b;
    }

</style>