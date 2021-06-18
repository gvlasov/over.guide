<template>
    <div class="markdown-explorer">
        <div v-for="part in textParts">
            <textarea>{{part.part.contentMd}}</textarea>
        </div>
    </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import GuideHistoryEntryVso from "@/ts/vso/GuideHistoryEntryVso";
import GuidePartText from "@/vue/guides/GuidePartText.vue";


@Component({
    components: {},
})
export default class MarkdownExplorer extends Vue {

    @Prop({required: true})
    entry: GuideHistoryEntryVso

    get textParts(): GuidePartText[] {
        return this.entry.parts.filter(part => part.isText) as GuidePartText[]
    }


};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";
@import "~@/assets/css/common.scss";

.markdown-explorer {
    textarea {
        width: 100%;
        height: native-min(20em, 100vh);
    }
}
</style>
