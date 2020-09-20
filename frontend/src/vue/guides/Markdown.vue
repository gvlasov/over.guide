<template>
    <div class="markdown" v-html="md"></div>
</template>

<script lang="ts">
import marked from 'marked'
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({})
export default class Markdown extends Vue {
    @Prop({required: true})
    code: string

    get md(): string {
        return marked(this.code)
    }
}

</script>

<style lang="scss" scoped>
@import '~@/assets/css/tags.scss';

.markdown {
    font-family: $body-font;

    & ::v-deep a {
        color: $tag-teammate-color;
        font-weight: bold;

        &:visited {
            color: $tag-player-color;
        }
    }

    & ::v-deep img {
        margin: 0 auto;
        display: block;
    }

    & ::v-deep table {
        margin: 0 auto;

        td, th {
            padding: .4em;
        }

        td {
            background-color: hsla(209, 18%, 45%, .8);
        }

        th {
            background-color: hsla(250, 18%, 45%, .8);
        }
    }
}
</style>
