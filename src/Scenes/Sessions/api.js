import composeHeader from '../../shared/Helpers/headers';
import store from '../../shared/store';
import actions from './actions';
require('dotenv').config();

const api = {
    getSessions: (phone = null) => {
        const url = !phone ? '/api/sessions' : `/api/sessions?phone=${phone}`;
        let { login } = store.getState();
        if (!login.user) return [];
        return new Promise((resolve, reject) => {
            let headers = composeHeader(login.token);

            fetch(url, {method: 'GET', headers: headers})
            .then(
                r => {
                    if (r.status != 200) return resolve(null);
                    return r.json()
                }
                )
            .then(list => {
                resolve(list);
            })
        })
    },
    getLogs: (phone) => {
        const url = `/api/sessions/get-logs`;
        let { login } = store.getState();
        if (!login.user) return [];
        return new Promise((resolve, reject) => {
            let headers = composeHeader(login.token);

            fetch(url, {method: 'POST', body: JSON.stringify({ phone: phone }), headers: headers})
            .then(
                r => {                    
                    if (r.status != 200) return resolve(null);
                    return r.json()
                }
            )
            .then(list => {
                resolve(list);
            })
        })
    },
    getCategories: () => {
        const url = '/api/categories';
        let { login } = store.getState();
        if (!login.user) return [];
        return new Promise((resolve, reject) => {
            let headers = composeHeader(login.token);
            fetch(url, {method: 'GET', headers: headers})
            .then(r => {
                if (r.status != 200) return resolve(null);
                return r.json();
            }

            )
            .then(list => {
                resolve(list);
            })
        })
    },
    saveSession: (session) => {
        const url = '/api/sessions';
        let { login } = store.getState();
        if (!login.user) return [];
        let headers = composeHeader(login.token);
        store.dispatch(actions.saveSession(null));
        return fetch(url, {method: 'POST', headers: headers, body: JSON.stringify(session)} ).then(r => console.log(r));
    },
    viewSession: (id) => {
        return {};
    },
    searchSessions: (phone) => {

    },
    sendMessage: async (phone, id) => {
        const url = '/api/sessions/send-message';
        let { login } = store.getState();
        if (!login.user) return '';
        let headers = composeHeader(login.token);
        let language = (login.user.country && login.user.country === 'italy')? 'en' : 'es'
        return fetch(url, {method: 'POST', headers: headers, body: JSON.stringify({ phone: phone, id: id, language: language })}).then(r => r.json()).then(res => { return res} );
    },
    sendMessageMessenger: async (phone, id, text) => {
        const url = '/api/sessions/send-message-messenger';
        let { login } = store.getState();
        if (!login.user) return '';
        let headers = composeHeader(login.token);

        return fetch(url, {method: 'POST', headers: headers, body: JSON.stringify({ phone: phone, id: id, text: text })}).then(r => r.json()).then(res => { return res} );
    },
    checkStatus: async(sid, id) => {
        const url = '/api/sessions/check-status';
        let { login } = store.getState();
        if (!login.user) return '';
        let headers = composeHeader(login.token);
        return fetch(url, {method: 'POST', headers: headers, body: JSON.stringify({ sid: sid, id: id })}).then(r => { return r.json() }).then( res => { return res });
    }

}

export default api;