<template>
    <div class="text-guide-part">
        <MarkdownGuide
                v-if="showMarkdownGuide && !widget.editing"
                @back="onMarkdownGuideBack"
        />
        <GuidePartText
                v-if="!widget.editing && !showMarkdownGuide"
                :part="widget.part"
        ></GuidePartText>
        <textarea
                v-if="widget.editing"
                ref="textarea"
                class="guide-part-text-editor"
                v-model="widget.part.contentMd"
                rows="10"
                @paste="(event) => onTextPaste(widget.part)(event)"
        ></textarea>
        <OverwatchButton
            v-if="!showMarkdownGuide && widget.editing"
            type="default"
            class="markup-help-button"
            v-hammer:tap="() => {showMarkdownGuide = true; widget.editing = false;}"
            >Markup help</OverwatchButton>
    </div>
</template>

<script>
import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";
import GuidePartText from "@/vue/guides/GuidePartText";
import MarkdownGuide from "@/vue/guides/MarkdownGuide";
import OverwatchButton from "@/vue/OverwatchButton";

export default {
        model: {},
        props: {
            widget: {
                type: GuidePartTextWidget,
                required: true,
            }
        },
        methods: {
            onMarkdownGuideBack() {
                this.showMarkdownGuide = false;
                this.widget.editing = true;
                this.$scrollTo(this.$el, 150, {
                    offset: -100,
                    onDone: ()  => {
                        this.$refs.textarea.focus();
                    }
                });
            },
            onTextPaste(part) {
                return (pasteEvent) => {
                    let paste = (pasteEvent.clipboardData || pasteEvent.originalEvent.clipboardData || window.clipboardData).items;
                    const uploadingText = '![Uploading...]()';
                    for (let item of paste) {
                        if (item.kind === 'file') {
                            pasteEvent.preventDefault();
                            var blob = item.getAsFile();
                            var reader = new FileReader();
                            reader.onload = async function (fileEvent) {
                                const formData = new FormData();
                                formData.append('image', fileEvent.target.result)
                                await fetch('https://api.imgur.com/3/image', {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': 'Client-ID 546c25a59c58ad7'
                                    },
                                    body: fileEvent.target.result.substr(22)
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
            },
        },
        data() {
            return {
                showMarkdownGuide: false,
                fixOverscroll: true,
            }
        },
    watch: {
        'widget.editing'(newValue) {
            if (newValue) {
                this.showMarkdownGuide = false;
            }
        }
    },
        components: {
            OverwatchButton,
            MarkdownGuide,
            GuidePartText,
        },
    };

</script>

<style lang="scss" scoped>
    @import '~@/assets/css/fonts.scss';
    .text-guide-part {
        padding-top:1em;
        max-width: 100%;
    }

    .text-guide-part ::v-deep img {
        max-width: 100%;
        margin: 0 auto;
        display: block;
    }

    textarea.guide-part-text-editor {
        width: 100%;
        max-width: 20em;
        font-size: 1em;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
    }
    .markup-help-button {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 1.2em;
        opacity: .5;
    }

</style>
