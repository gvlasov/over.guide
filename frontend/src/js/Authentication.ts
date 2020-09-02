import Cookies from 'js-cookie'


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

    get userId(): string | undefined {
        return Cookies.get('userId');
    }

    logout() : void {
        Cookies.remove('auth-token')
        Cookies.remove('username')
        Cookies.remove('userId')
        window.location.href = '/';
    }

}

