import Cookies from 'universal-cookie';

var UserProfile = (function () {
    var token = "";

    var getToken = function () {
        const cookies = new Cookies();
        token = cookies.get('token')
        return token;
    };

    var setRememberToken = function (param) {
        const cookies = new Cookies();
        cookies.set('token', param, { path: '/', maxAge: 604800 });
    };

    var setToken = function (param) {
        const cookies = new Cookies();
        cookies.set('token', param, { path: '/', maxAge: 900 });
    };

    var setLogout = function () {
        const cookies = new Cookies();
        cookies.remove('token')
    }

    return {
        getToken: getToken,
        setToken: setToken,
        setRememberToken: setRememberToken,
        setLogout: setLogout
    }

})();

export default UserProfile;