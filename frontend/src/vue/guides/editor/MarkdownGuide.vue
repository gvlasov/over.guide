<template>
    <div class="markdown-guide">
        <table>
            <tr v-for="(item, index) in items" :key="index">
                <td class="code-example">
                    <textarea
                            v-bind:style="{height: (linesInCode(item)+1.5)+'em'}"
                            v-model="items[index]"
                    ></textarea>
                </td>
                <Markdown :code="item"/>
            </tr>
        </table>
        <StickyHoverer>
            <OverwatchButton
                    type="default"
                    class="back-button"
                    v-hammer:tap="() => $emit('back')"
            >Back
            </OverwatchButton>
        </StickyHoverer>
    </div>
</template>

<script lang="ts">
import marked from 'marked'
import Markdown from "@/vue/guides/Markdown";
import OverwatchButton from "@/vue/OverwatchButton";
import Vue from 'vue'
import Component from "vue-class-component";
import StickyHoverer from "@/vue/StickyHoverer.vue";

@Component({
    components: {
        StickyHoverer,
        OverwatchButton,
        Markdown,
    }
})
export default class MarkdownGuide extends Vue {

    items: string[] = [
        'just text',
        '[Link](https://youtube.com) or just https://youtube.com',
        '![image with alt text](https://d1u1mce87gyfbn.cloudfront.net/hero/genji/icon-portrait.png)',
        '- Widowmaker\n- Hanzo\n- Ashe\n- Ana',
        "1. List\n2. Of\n3. Several\n  - Possibly\n  - Nested\n4. Items",
        '**bold text**',
        '*italic text*',
        '`monospaced text`',
        '|heading 1 | heading 2|\n|---|---|\n|row 1 col a|row 1 col b|\n|row 2 col a|row 2 col b|',
        '# Huge header',
        '## Big header',
        '### Regular header',
        '#### Smaller header',
        '##### Tiny header',
        '###### Teeny-weeny header',
        '> quote',
        '- [x] dart\n- [ ] nade\n- [ ] nano',
        'horizontal\n\n---\n\nline',
    ]

    md(code) {
        return marked(code)
    }

    linesInCode(code) {
        return code.split(/\r\n|\r|\n/).length
    }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';
@import '~@/assets/css/overwatch-ui.scss';

.markdown-guide {
    margin: 0 auto 1em auto;
    max-width: 30em;
    text-align: center;

    .sticky-hoverer {
        margin-top: 1em;
        bottom: 2.75em;
        button {
            font-size: 2.5em;
        }
    }

    table {
        width: 100%;
        border-spacing: .3em;

        td {
            //background-color: hsla(209, 18%, 20%, .8);
            padding: .5em;

            textarea {
                max-width: 20em;
                min-height: 5em;
                font-family: "Akkurat Mono", sans-serif;
                resize: none;
                overflow-y: scroll;
                font-size: .8em;
            }

            &.code-example {
                text-align: left;
            }
        }

        .markdown {
            display: table-cell;
            text-align: left;
        }
    }
}
</style>
