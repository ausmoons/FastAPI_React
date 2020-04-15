import { message } from 'antd';

class Auth {
    constructor() {
        this.authenticated = false;
    }

    login(cb) {
        this.authenticated = true;
        message.success('You logged in');
        cb();
    }

    logout(cb) {
        localStorage.removeItem('token')
        this.authenticated = false;
        message.success('You logged out');
        cb();
    }

    isAuthenticated() {
        return this.authenticated;
    }
}

export default new Auth();
