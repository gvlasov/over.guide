import Vue from 'vue'

export class EventBus {

    private static _instance: Vue

    private constructor(private vue: Vue = new Vue()) {
    }

    static get instance(): Vue {
        if (this._instance === void 0) {
            this._instance = new Vue()
        }
        return this._instance
    }

}
