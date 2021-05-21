import Cookies from 'js-cookie'
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";


export default class Authentication {

    private static _instance: Authentication

    static get instance(): Authentication {
        if (Authentication._instance === void 0) {
            Authentication._instance = new Authentication()
            Cookies.defaults = {
                domain: process.env.COOKIE_DOMAIN
            };
        }
        return Authentication._instance;
    }

    get authenticated(): boolean {
        return typeof this.authToken !== "undefined";
    }

    get authToken(): string | undefined {
        return Cookies.get('auth-token');
    }

    get username(): string | undefined {
        return Cookies.get('username');
    }

    setUsername(value: string) {
        Cookies.set('username', value);
    }

    get userId(): number | undefined {
        const userId = Cookies.get('userId');
        if (userId !== undefined) {
            return Number.parseInt(userId)
        } else {
            return userId;
        }
    }

    get loggedIn(): boolean {
        return this.userId !== void 0
    }

    logoutSite(): void {
        this.removeAuthCookies()
        window.location.href = '/'
    }

    removeAuthCookies() {
        Cookies.remove('auth-token')
        Cookies.remove('username')
        Cookies.remove('userId')
    }

    logoutBattleNet() {
        window.location.href = this.battleNetLogoutUrl;
    }

    get battleNetLogoutUrl(): string {
        return 'https://account.blizzard.com/api/logout';
    }

    canEditGuide(entry: ExistingGuideHistoryEntryVso): boolean {
        if (entry.author === undefined) {
            throw new Error('Guide doesn\'t have author')
        }
        return this.userId === entry.author.id;
    }

}

