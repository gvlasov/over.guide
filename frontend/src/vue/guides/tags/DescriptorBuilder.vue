<template>
    <div class="searchbox">
        <TagBuilder
                :guide-hero-tag="descriptor.heroTag"
                style="display: inline-block;"
        />
        <ThematicTagInput
                style="display: inline-block;"
                v-model="descriptor.thematicTags"
                :selected-tags="descriptor.thematicTags"
        />
        <button
                v-if="searchButtonEnabled"
                class="overwatch-main-button search-button"
                v-hammer:tap="onSearch"
        >Search
        </button>
    </div>
</template>

<script>
    import SeededShuffler from "@/js/SeededShuffler";
    import TagBuilder from "@/vue/guides/tags/hero/TagBuilder";
    import ThematicTagInput from "@/vue/guides/ThematicTagInput";

    export default {
        name: "DescriptorBuilder",
        props: {
            descriptor: {
                /** @see GuideDescriptor */
                type: Object,
                required: true,
            },
            searchButtonEnabled: {
                type: Boolean,
                default: true,
            }
        },
        data() {
            return {
                heroTag: {
                    playerHeroes: [],
                    allyHeroes: [],
                    enemyHeroes: [],
                },
                thematicTags: [],
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
            onSearch() {
                this.$emit(
                    'search',
                    this.descriptor,
                )
            },
        },
        components: {
            TagBuilder,
            ThematicTagInput,
        }
    }
</script>

<style scoped>
    .search-button {
        font-size: 2em;
    }

    .searchbox {
        display: inline-block;
        box-sizing: border-box;
        padding: .5em .5em .5em .25em;

        background: #fff;

        border: 1px solid transparent;
        border-radius: .25em;
        border-color: #dbdbdb;
    }

    .searchbox > * {
        vertical-align: middle;
    }

    .searchbox.active {
        border: 1px solid #8bbafe;
        box-shadow: 0 0 0 0.2em rgba(13, 110, 253, 0.25);
        outline: 0 none;
    }
</style>