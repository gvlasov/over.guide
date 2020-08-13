<template>
    <div class="searchbox">
        <TagBuilder
                :descriptor="descriptor"
                style="display: block;"
                @tagChange="$emit('descriptorChange')"
        />
        <ThematicTagInput
                style="display: block; min-width: 17em; flex-grow: 1;"
                :descriptor="descriptor"
                @tagChange="$emit('descriptorChange')"
        />
        <OverwatchButton
                v-if="searchButtonEnabled"
                :type="'main'"
                v-hammer:tap="onSearch"
                class="search-button"
        >Search
        </OverwatchButton>
    </div>
</template>

<script>
    import TagBuilder from "@/vue/guides/tags/hero/TagBuilder";
    import ThematicTagInput from "@/vue/guides/ThematicTagInput";
    import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
    import OverwatchButton from "@/vue/OverwatchButton";

    export default {
        name: "DescriptorBuilder",
        props: {
            descriptor: {
                type: GuideDescriptorVso,
                required: true,
            },
            searchButtonEnabled: {
                type: Boolean,
                default: true,
            }
        },
        data() {
            return {};
        },
        watch: {},
        computed: {},
        methods: {
            onSearch() {
                this.$emit('search', this.descriptor)
            },
        },
        components: {
            OverwatchButton,
            TagBuilder,
            ThematicTagInput,
        }
    }
</script>

<style lang="scss" scoped>
    .search-button {
        font-size: 2.8em;
        margin-right: .5rem;

        & ::v-deep .background {
            opacity: .8;
        }
    }

    .searchbox {
        display: flex;
        gap: .2em;
        flex-wrap: wrap;
        justify-content: center;
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