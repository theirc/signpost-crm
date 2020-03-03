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
            .then(r => r.json())
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

        return fetch(url, {method: 'POST', headers: headers, body: JSON.stringify({ phone: phone, id: id })}).then(r =>  r.json()).then(res => { return res} );
    },
    checkStatus: async(sid) => {
        const url = '/api/sessions/check-status';
        let { login } = store.getState();
        if (!login.user) return '';
        let headers = composeHeader(login.token);
        let result = await fetch(url, {method: 'POST', headers: headers, body: JSON.stringify({ sid: sid })}).then(r =>  {return r});
    }

}

export default api;