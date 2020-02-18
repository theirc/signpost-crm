import composeHeader from '../../shared/Helpers/headers';
import store from '../../shared/store';
import actions from './actions';

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
        let headers = composeHeader(login.token);
        return fetch(url, {method: 'GET', headers: headers})
        .then(r => {
            return r.json()
        })
        .then(list => {
            console.log("List", list);
            return list;
        })
    },
    saveSession: (session) => {
        const url = '/api/sessions';
        let { login } = store.getState();
        if (!login.user) return [];
        let headers = composeHeader(login.token);
        store.dispatch(actions.saveSession(null));
        console.log("Save session", headers, session);
        return fetch(url, {method: 'POST', headers: headers, body: JSON.stringify(session)} ).then(r => console.log(r));
    },
    viewSession: (id) => {
        return {};
    },
    searchSessions: (phone) => {

    }

}

export default api;