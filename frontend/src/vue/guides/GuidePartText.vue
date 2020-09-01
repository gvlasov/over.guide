<template>
    <div class="text-guide-part-content" v-html="render(part)"></div>
</template>

<script>
import marked from 'marked'

export default {
    model: {},
    props: {
        part: {
            type: Object,
            required: true,
        }
    },
    methods: {
        render() {
            return marked(this.part.contentMd)
        },
    },
    data() {
        return {}
    },
    components: {},
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';

.text-guide-part-content {
    text-align: left;
    pointer-events: none;
    font-size: 1.5em;
    word-break: break-word;
    font-family: $body-font;
}
</style>
