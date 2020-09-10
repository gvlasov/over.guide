<template>
    <div class="text-guide-part-content">
        <Markdown
            :code="part.contentMd"
        />
    </div>
</template>

<script>
import Markdown from "@/vue/guides/Markdown";

export default {
    props: {
        part: {
            type: Object,
            required: true,
        }
    },
    components: {Markdown},
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';
@import '~@/assets/css/tags.scss';

.text-guide-part-content {
    text-align: left;
    font-size: 1.5em;
    word-break: break-word;
    font-family: $body-font;
}
</style>
