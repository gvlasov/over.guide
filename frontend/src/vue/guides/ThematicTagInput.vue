<template>
    <tags-input
            class="thematic-tag-input"
            :existing-tags="existingTags"
            v-model="descriptor.individualTags"
            :placeholder="placeholder"
            :typeahead="true"
            :typeahead-hide-discard="true"
            :only-existing-tags="true"
            :typeahead-activation-threshold="0"
            :sort-search-results="false"
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

<script lang="ts">
import VoerroTagsInput from '@voerro/vue-tagsinput';
import SeededShuffler from "data/generators/SeededShuffler";
import ThematicTagVso from "@/ts/vso/ThematicTagVso";
import MapTagVso from "@/ts/vso/MapTagVso";
import maps from 'data/maps'
import thematicTags from 'data/thematicTags'
import ThematicTagBadge from "@/vue/guides/tags/ThematicTagBadge";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

import 'reflect-metadata'
import IndividualTagVso from "../../js/vso/IndividualTagVso";

@Component({
    components: {
        'tags-input': VoerroTagsInput,
        ThematicTagBadge,
    }
})
export default class ThematicTagInput extends Vue {
    @Prop({required: true})
    descriptor: GuideDescriptorVso

    existingTags: IndividualTagVso[] = this.getExistingTags()


    get placeholder(): string {
        if (
            this.descriptor.individualTags.length === 0
        ) {
            const shuffler = new SeededShuffler(new Date().getTime());
            return shuffler
                .shuffle(
                    Array.from(thematicTags.values())
                        .map(it => it.name)
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
    }

    getExistingTags(): IndividualTagVso[] {
        return (
            Array.from(thematicTags.values())
                .map(theme => new ThematicTagVso(theme))
                .concat(
                    Array.from(maps.values())
                        .map(map => new MapTagVso(map))
                )
        )
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/css/fonts.scss";
@import "~@voerro/vue-tagsinput/dist/style.css";
@import "~@/assets/css/tags.scss";
@import "~@/assets/css/overwatch-ui.scss";

.thematic-tag-input {

    & ::v-deep .tags-input-badge {
        padding: 0;
        margin: 0;
        font-size: 1.3em;
        border-radius: 0;
        background-color: transparent;
        line-height: 1em;
        cursor: pointer;
        font-weight: normal;

        & ::v-deep .tags-input {
            & > .tags-input-badge:hover {
                opacity: .3;
            }

            span {
                margin: 0;
            }
        }
    }

    & ::v-deep .typeahead-badges {
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

    & ::v-deep .typeahead-badges > .tags-input-typeahead-item-default,
    & ::v-deep .typeahead-badges > .tags-input-typeahead-item-highlighted-default {
        font-size: 1.5em;
        padding: .18em .3em .3em .3em;
        border-radius: .2em;
        @include overwatch-futura;
        text-transform: lowercase;
        font-weight: normal;
        box-shadow: 0 0 .06em #111;
    }

    & ::v-deep .tags-input-wrapper-default {
        display: flex;
        justify-content: flex-start;
        box-sizing: border-box;
        gap: .2em;
        border: none;
        position: relative;
        padding: .3rem .5rem .3rem .5rem;
        height: 100%;
        box-shadow: 0 .05em .35em -.05em inset hsl(279, 30%, 30%);
        border-radius: .5em;
        margin: 0 .4em 0 0;
        background-color: hsl(338, 80%, 96%);

        input[type=text] {
            font-family: $body-font;
            font-size: .9em;
        }
    }

    & ::v-deep .tags-input input[type=text] {
        display: inline-block;
        width: 2em;
        padding-right: .5em;
        height: 2em;
    }
}


::v-deep .theme > *, ::v-deep .typeahead-badges .theme {
    @include tag-bg-theme;
}

::v-deep .map > *, ::v-deep .typeahead-badges .map {
    @include tag-bg-map;
}

</style>