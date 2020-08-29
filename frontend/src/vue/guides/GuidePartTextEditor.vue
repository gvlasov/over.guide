<template>
    <div class="text-guide-part">
        <div v-if="!widget.editing" class="text-guide-part-content"
             v-html="widget.render()"
        ></div>
        <textarea
                v-if="widget.editing"
                class="guide-part-text-editor"
                v-model="widget.part.contentMd"
                rows="10"
                @paste="(event) => onTextPaste(widget.part)(event)"
        ></textarea>
    </div>
</template>

<script>
import GuidePartTextWidget from "@/js/vso/GuidePartTextWidget";

export default {
        model: {},
        props: {
            widget: {
                type: GuidePartTextWidget,
                required: true,
            }
        },
        methods: {
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
            return {}
        },
        components: {},
    };

</script>

<style lang="scss" scoped>
    @import '~@/assets/css/fonts.scss';
    .text-guide-part {
        max-width: 100%;
    }

    .text-guide-part ::v-deep img {
        max-width: 100%;
    }

    .text-guide-part-content {
        text-align: left;
        pointer-events: none;
        font-size: 1.5em;
        word-break: break-word;
        font-family: $body-font;
    }

    textarea.guide-part-text-editor {
        width: 100%;
        max-width: 20em;
        font-size: 1em;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
    }

</style>
