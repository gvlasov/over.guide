<template>
    <div class="markdown" v-html="md"></div>
</template>

<script>
import marked from 'marked'

export default {
    props: {
        code: {
            type: String,
            required: true,
        }
    },
    methods: {},
    computed: {
        md() {
            return marked(this.code)
        },
    },
    data() {
        return {}
    }
};

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

    & ::v-deep table  {
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
