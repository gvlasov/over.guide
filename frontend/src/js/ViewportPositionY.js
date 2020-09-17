import Vue from 'vue'

export default new Vue({
    data() {
        return {
            y: null,
            height: null,
        }
    },
    computed: {
        center() {
            return this.y + this.height / 2;
        },
    },
    created() {
        this.y = window.scrollY
        this.height = document.documentElement.clientHeight
        window.addEventListener('scroll', e => {
            requestAnimationFrame(() => {
                this.y = window.scrollY
            })
        })
        window.addEventListener('resize', e => {
            requestAnimationFrame(() => {
                this.height = document.documentElement.clientHeight;
            })
        })
    },
})

