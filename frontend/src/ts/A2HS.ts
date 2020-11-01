export default class A2HS {

    private static _instance: A2HS

    static get instance(): A2HS {
        if (A2HS._instance === void 0) {

            A2HS._instance = new A2HS()
        }
        return A2HS._instance;
    }

    get enabled(): boolean {
        return this.installEvent !== null
    }

    get runningAsPwa(): boolean {
        return window.matchMedia('(display-mode: standalone)').matches
    }

    get installEvent(): { prompt: () => void } {
        return (window as any).deferredPrompt
    }

}

