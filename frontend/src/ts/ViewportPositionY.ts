import Vue from 'vue'

class ViewportPositionY extends Vue {
    y: number = window.scrollY
    height: number = document.documentElement.clientHeight

    get center() {
        return this.y + this.height / 2;
    }

    created() {
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
    }
}

export default new ViewportPositionY()

