import composeHeader from '../../shared/Helpers/headers';
import store from '../../shared/store';
//import actions from './actions';

const api = {
    getTasks: (phone = null, user= null) => {
        const url = !phone ? '/api/tasks' : `/api/tasks?phone=${phone}`;
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
    saveTask: (task) => {
        const url = '/api/tasks';
        let { login } = store.getState();
        if (!login.user) return [];
        let headers = composeHeader(login.token);
        //store.dispatch(actions.saveTask(null));
        return fetch(url, {method: 'POST', headers: headers, body: JSON.stringify(task)} );
    },
    viewTask: (id) => {
        return {};
    }

}

export default api;