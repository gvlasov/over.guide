<template>
    <div class="searchbox">
        <TagBuilder
                :guide-hero-tag="descriptor.heroTag"
                style="display: table-cell;"
        />
        <ThematicTagInput
                style="display: table-cell; width: 100%;"
                v-model="selectedTags"
                :selected-tags="selectedTags"
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
    import TagClass from "@/js/dto/TagClass";
    import MapTag from "@/js/dto/MapTag";
    import ThemeTag from "@/js/dto/ThemeTag";

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
            const selectedTags = this.descriptor.mapTags
                .map(map => {
                    return new MapTag(map)
                })
                .concat(
                    this.descriptor.thematicTags
                        .map(theme => {
                            return new ThemeTag(theme)
                        })
                );
            return {
                selectedTags: selectedTags
            };
        },
        watch: {
            selectedTags: function (oldTags, newTags) {
                console.log(newTags)
                this.descriptor.mapTags.replaceAll(
                    newTags
                        .filter(tag => tag.class === TagClass.Map)
                        .map(tag => Number.parseInt(tag.name, 10))
                );
                this.descriptor.thematicTags.replaceAll(
                    newTags
                        .filter(tag => tag.class === TagClass.Theme)
                        .map(tag => Number.parseInt(tag.name, 10))
                );
                console.log(this.descriptor.mapTags)
            }
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
        display: inline-table;
        box-sizing: border-box;
        padding: .5rem 0 .5rem .5rem;
        background: #fff;
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