import Cookies from 'js-cookie'
import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";


export default class Authentication {

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

    logoutSite(): void {
        Cookies.remove('auth-token')
        Cookies.remove('username')
        Cookies.remove('userId')
        window.location.href = '/'
    }

    logoutBattleNet() {
        window.location.href = this.battleNetLogoutUrl;
    }

    get battleNetLogoutUrl() : string {
        return 'https://account.blizzard.com/api/logout';
    }

    canEditGuide(guide: ExistingGuideHeadVso): boolean {
        if (guide.entry.author === undefined) {
            throw new Error('Guide doesn\'t have author')
        }
        return this.userId === guide.entry.author.id;
    }

}

