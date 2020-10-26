<template>
    <div class="root-content-sizer">
        <div
                v-if="$asyncComputed.head.success"
                class="root-content-panel-wrap"
        >
            <BackgroundHeading
                    v-if="head === 404"
            >Guide doesn't exist
            </BackgroundHeading>
            <BackgroundHeading
                    v-else-if="head === 403"
            >You are not allowed to view this guide
            </BackgroundHeading>
            <Guide
                    v-else
                    :head="head"
                    :search-descriptor="null"
                    :initial-show-comments-section="true"
            />
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import Backend from "@/ts/Backend";
import Authentication from "@/ts/Authentication";
import Vue from 'vue'
import Component from "vue-class-component";
import Guide from "@/vue/guides/Guide.vue";
import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import AsyncComputedProp from "vue-async-computed-decorator";
import BackgroundHeading from "@/vue/BackgroundHeading.vue";

const backend = new Backend(axios);
const auth = new Authentication()
@Component({
    components: {
        BackgroundHeading,
        Guide,
    },
})
export default class GuidePage extends Vue {

    declare head: ExistingGuideHeadVso | 404 | 403;

    declare $route;

    @AsyncComputedProp()
    async head() {
        return backend.getGuide(this.$route.params.id)
            .then(guide => new ExistingGuideHeadVso(guide))
            .catch(error => {
                if (error.response.status === 404 || error.response.status === 403) {
                    return error.response.status
                } else {
                    throw error;
                }
            })
    }

}

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';
</style>
