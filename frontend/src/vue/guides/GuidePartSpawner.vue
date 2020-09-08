<template>
    <div class="create-buttons">
        <OverwatchButton
                :type="'default'"
                class="create-new-part-button"
                v-hammer:tap="createNewTextPart"
                data-type="text"
        >+ text
        </OverwatchButton>
        <OverwatchButton
                :type="'default'"
                class="create-new-part-button"
                data-type="video"
                v-hammer:tap="createNewVideoPart"
        >+ video
        </OverwatchButton>
    </div>
</template>

<script>
import OverwatchButton from "@/vue/OverwatchButton";
import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";
import GuidePartVideoWidget from "@/js/vso/GuidePartVideoWidget";


export default {
    props: {
        parts: {
            type: Array,
            required: true,
        },
        where: {
            type: String,
            required: true,
        }
    },
    methods: {
        createNewTextPart(where) {
            this.createNewPart(
                () => new GuidePartTextWidget(
                    {
                        kind: 'text',
                        contentMd: ''
                    },
                    true
                )
            );
        },
        createNewVideoPart() {
            this.createNewPart(
                () =>
                    new GuidePartVideoWidget(
                        {
                            kind: 'video',
                            excerpt: null,
                        },
                        true
                    )
            );
        },
        /**
         * @callback how
         */
        createNewPart(how) {
            (
                (this.where === 'beginning')
                    ? this.parts.unshift
                    : this.parts.push
            )
                .apply(this.parts, [how()]);
        },
    },
    data() {
        return {}
    },
    computed: {},
    components: {
        OverwatchButton,
    },
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';
@import '~@/assets/css/overwatch-ui.scss';
.create-buttons {
    display: flex;
    justify-content: space-evenly;
    z-index: 1;
    margin: .3em;

    & > * {
        font-size: 2rem;
        flex-shrink: 1;
        flex-basis: 5em;
    }

    & > * ::v-deep .content {
        padding-left: 0;
        padding-right: 0;
    }

    .create-new-part-button {
        white-space: nowrap;
    }
}
</style>
