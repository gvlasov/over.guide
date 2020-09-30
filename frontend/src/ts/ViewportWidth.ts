import Vue from 'vue'

class ViewportWidth extends Vue {
    width: number = document.documentElement.clientWidth

    created() {
        window.addEventListener('resize', e => {
            requestAnimationFrame(() => {
                this.width = document.documentElement.clientWidth;
            })
        })
    }
}

export default new ViewportWidth()

