<template>
    <div
            class="scroll-to-top"
            v-show="isShowing"
            v-hammer:tap="onTap"
    >
        <div class="hover-display-container">
            <div class="background"></div>
            <img v-bind:src="imgSrc" class="arrow"/>
            <div class="text">{{isAtTop ? 'Scroll back' : 'Scroll to top'}}</div>
        </div>
    </div>
</template>

<script>

    export default {
        methods: {
            onTap() {
                window.scrollTo({
                    behavior: 'auto',
                    top: this.isAtTop ? this.deepestScrollY : 0,
                })
            },
            reset() {
                this.isShowing = false;
                this.scrollY = window.scrollY;
                this.deepestScrollY = window.scrollY;
            },
        },
        data() {
            return {
                isShowing: false,
                scrollY: 0,
                deepestScrollY: 0,
            };
        },
        computed: {
            imgSrc() {
                if (this.isAtTop) {
                    return '/icons/arrow-down-white.svg';
                } else {
                    return '/icons/arrow-up-white.svg';
                }
            },
            isAtTop() {
                return this.scrollY === 0;
            },
        },
        components: {},
        mounted() {
            window.addEventListener('scroll', () => {
                this.isShowing = true;
                this.scrollY = window.scrollY;
                this.deepestScrollY = Math.max(this.scrollY, this.deepestScrollY);
            });
        },
    }
</script>

<style lang="scss" scoped>
    @import "~@/assets/css/overwatch-ui.scss";
    @import "~@/assets/css/common.scss";

    $aside-width: 10rem;

    .scroll-to-top {
        user-select: none;
        cursor: pointer;
        @include overwatch-futura;
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: 50vw;
        text-align: left;

        .hover-display-container {
            text-align: center;
            padding: 1.5em 1em 0 1em;
            height: 100%;
            width: $aside-width;
            box-sizing: border-box;

            & > * {
                position: relative;
                z-index: 1;
                vertical-align: middle;
            }

            .background {
                position: absolute;
                top: 0;
                left: 0;
                background-color: $overwatch-panel-bg-color;
                opacity: .08;
                height: 100%;
                width: $aside-width;
                z-index: 0;
            }

            .arrow {
                max-width: 1em;
                margin-right: .3em;
            }

            .text {
                display: inline-block;
            }
        }

        &:hover {
            .background {
                animation: .13s linear both hover;
            }

            .hover-display-container {
                box-shadow: 0 0 .3em 0 white;
            }
        }

        @keyframes hover {
            to {
                opacity: .18;
            }
        }

    }

    $min-screen-width: $root-content-width + $aside-width*2;

    @media screen and (max-width: $min-screen-width) {
        .scroll-to-top {
            display: none;
        }
    }
</style>
