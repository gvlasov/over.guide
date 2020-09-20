<template>
    <div class="text-guide-part-content">
        <Markdown
                :code="part.contentMd"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import GuidePartTextDto from "data/dto/GuidePartTextDto";
import Component from "vue-class-component";
import Markdown from '@/vue/guides/Markdown'

@Component({
    components: {
        Markdown,
    },
})
export default class GuidePartText extends Vue {
    @Prop({required: true})
    part: GuidePartTextDto
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
