<template>
    <div class="text-guide-part">
        <GuidePartText
                v-if="!widget.editing"
                :part="widget.part"
        ></GuidePartText>
        <textarea
                v-if="widget.editing"
                ref="textarea"
                class="guide-part-text-editor"
                v-model="widget.part.contentMd"
                rows="10"
                @paste="(event) => onTextPaste(widget.part)(event)"
                @keypress="onKeypress"
        ></textarea>
    </div>
</template>

<script lang="ts">
import GuidePartTextWidget from "@/ts/vso/GuidePartTextWidget";
import GuidePartText from "@/vue/guides/GuidePartText";
import OverwatchButton from "@/vue/OverwatchButton";
import Vue from 'vue'
import Component from "vue-class-component"
import {Prop, Ref, Watch} from "vue-property-decorator";
import GuidePartTextDto from "data/dto/GuidePartTextDto"

@Component({
    components: {
        OverwatchButton,
        GuidePartText,
    },
})
export default class GuidePartTextEditor extends Vue {
    @Ref('textarea') textarea: HTMLInputElement

    @Prop({required: true})
    widget: GuidePartTextWidget

    onKeypress(e: KeyboardEvent) {
        if (e.key === 'Enter' && e.ctrlKey) {
            this.$emit('save')
        }
    }

    @Watch('widget.editing')
    onEditStart(editing: boolean) {
        if (editing) {
            this.$nextTick(() => {
                this.textarea.focus()
            })
        }
    }

    onTextPaste(part: GuidePartTextDto) {
        return (pasteEvent) => {
            let paste = (pasteEvent.clipboardData || pasteEvent.originalEvent.clipboardData).items;
            const uploadingText = '![Uploading...]()';
            for (let item of paste) {
                if (item.kind === 'file') {
                    pasteEvent.preventDefault();
                    var blob = item.getAsFile();
                    var reader = new FileReader();
                    reader.onload = async function (fileEvent: ProgressEvent<FileReader>) {
                        const formData = new FormData();
                        let result = fileEvent.target.result;
                        if (result instanceof ArrayBuffer) {
                            // https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
                            result = String.fromCharCode.apply(null, new Uint16Array(result)) as string
                        } else if (result === null) {
                            throw new Error('File result is null')
                        }
                        formData.append('image', result)
                        await fetch('https://api.imgur.com/3/image', {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Client-ID ' + process.env.IMGUR_CLIENT_ID
                            },
                            body: result.substr(22)
                        }).then(
                            async response => {
                                const responseJson = await response.json();
                                part.contentMd =
                                    pasteEvent.target.value.replace(
                                        uploadingText,
                                        `![](${responseJson.data.link})`
                                    )
                            }
                        )
                    };
                    pasteEvent.target.value += "\n" + uploadingText;
                    reader.readAsDataURL(blob);
                }
            }
        };
    }
    mounted() {
        if (this.widget.editing) {
            this.$nextTick(() => {
                this.textarea.focus()
            })
        }
    }

}
</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';

.text-guide-part {
    padding-top: .5em;
    max-width: 100%;

    & ::v-deep img {
        max-width: 100%;
        margin: 0 auto;
        display: block;
    }

    textarea {
        outline: none;
        width: 100%;
        box-sizing: border-box;

        &.guide-part-text-editor {
            width: 100%;
            font-size: 1em;
            // As in Github issue editing
            @include standard-textarea;
        }
    }

}
</style>
