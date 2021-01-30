<template>
    <OverwatchPanel class="support-website">
        <p>
            Hi, my name is Georgy Vlasov. <a>smol.guides</a> is my personal endeavor.
        </p>
        <div class="methods">
            <a
                    v-for="method in methods"
                    :key="method.name"
                    class="method"
                    :href="method.url"
                    v-bind:class="'method-'+method.icon"
            >
                <OverwatchPanelButton
                        type="default"
                >
                    <font-awesome-icon :icon="['fab', method.icon]"/>
                    <div class="name">{{ method.name }}</div>
                    <div>
                        <HeroPortrait :hero="method.hero"/>
                    </div>
                </OverwatchPanelButton>
            </a>
        </div>
        <p>I love developing this project and hope to make a living off of it, growing it into a well-organized no-bullshit repository of knowledge. My goal is to help Overwatch players learn the game and ultimately git gud, so we have a healthier community and our games are more fun.</p>
        <p>Learning every relevant aspect of the game is hard. I watch a lot of educational videos in hope to get better. In these videos I find
            nuggets&nbsp;of&nbsp;knowledge that I know I must internalize in order to get better. When these nuggets are separated from unimportant information, collected and categorized, it is easy for anyone to learn them.
        </p>
        <p>If you like what I do, please support me, so I can do that more and better.</p>
    </OverwatchPanel>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import heroes from 'data/heroes'
import HeroId from "data/HeroId";
import HeroPortrait from "@/vue/HeroPortrait.vue";
import OverwatchPanel from "@/vue/general/OverwatchPanel.vue";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton.vue";

@Component({
    components: {OverwatchPanelButton, OverwatchPanel, HeroPortrait}
})
export default class SupportWebsitePage extends Vue {
    methods = [
        {
            name: 'Patreon',
            icon: 'patreon',
            hero: heroes.get(HeroId.Mei),
            url: 'https://patreon.com',
        },
        {
            name: 'PayPal',
            icon: 'paypal',
            hero: heroes.get(HeroId.Soldier),
            url: 'https://paypal.com',
        },
        {
            name: 'Bitcoin',
            icon: 'bitcoin',
            hero: heroes.get(HeroId.Sombra),
            url: 'https://bitcoin.com',
            text: 'bc1qw4jkdwat5eswgyc4zhhvq09amthr3fcq9lvvzk'
        },
    ]
}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.support-website {
    padding: 1em;

    p {
        text-align: left;
        font-size: 1.3em;
        line-height: 1.5em;
        margin: 2em 0;
        color: hsl(0, 0%, 100%, .8);
    }

    .methods {
        display: flex;
        float: right;
        margin-left: 2em;
        flex-direction: column;
        gap: 1em;

        .method {
            button {
                position: relative;
                width: 100%;
                background-color: hsla(24, 100%, 50%, .3);
                gap: 1em;

                & ::v-deep .content {
                    font-size: 1rem;
                    padding: 1em 2em;
                    width: 100%;
                    display: flex;
                    box-sizing: border-box;
                    align-items: center;
                }
            }

            .name {
                flex-grow: 1;
                font-size: 3em;
                @include overwatch-futura;
                margin-right: .9em;
            }

            svg {
                font-size: 3em;
                margin-right: .3em;
            }

            img {
                position: absolute;
                flex-grow: 0;
                flex-shrink: 0;
                height: 100%;
                width: auto;

                top: 0;
                right: 0;
            }
        }

        .method-patreon {
            button ::v-deep .background {
                background-color: #F16551;
            }
        }

        .method-paypal {
            button ::v-deep .background {
                background-color: #1696D0;
            }
        }

        .method-bitcoin {
            button ::v-deep .background {
                background-color: #EE8E12;
            }
        }
    }
}
</style>
