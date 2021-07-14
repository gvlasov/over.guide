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
    word-break: break-word;
    font-family: $body-font;
}


::v-deep h1 {
    font-size: 1.8rem;
}
::v-deep h2 {
    font-size: 1.6rem;
}
::v-deep h3 {
    font-size: 1.3rem;
}
::v-deep h4 {
    font-size: 1.1rem;
}
::v-deep h5 {
    font-size: 1rem;
}
::v-deep h6 {
    font-size: .7rem;
}
</style>
