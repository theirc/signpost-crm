import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import settingsReducers from '../Scenes/Settings/reducers'
import loginReducers from '../Scenes/Login/reducers'

const window = global.window || {};

let initialState = {
	  login: {
	  	user: null,
    },
    settings: {
		  language: 'en-US'
	  }
};
const persist = state => {
	try {
		localStorage.setItem('state', JSON.stringify(state));
	} catch(e) {
		console.log(e);
  }
}
const load = () => {
	try {
		const serializedState = localStorage.getItem('state');

		if(serializedState) {
			let state = JSON.parse(serializedState);
			// Overrides on reload
			state.router.location.pathname = window.location.pathname; // update router if url changed
			state.login.timedOut = initialState.login.timedOut; // override timeout message on login scene refresh
			
			return state;
		}
		
		return undefined;
	} catch(e) {
		console.log(e);

		return undefined;
	}
}

export const history = createBrowserHistory();

const enhancers = window.__REDUX_DEVTOOLS_EXTENSION__ ?
	compose(applyMiddleware(routerMiddleware(history)), window.__REDUX_DEVTOOLS_EXTENSION__()) :
    compose(applyMiddleware(routerMiddleware(history)));
    
const reducers = {
    login: loginReducers,
    router: connectRouter(history),
    settings: settingsReducers,
};


const persistedState = load();

const store = createStore(combineReducers({ ...reducers }), persistedState || initialState, enhancers);
store.subscribe(() => persist(store.getState()));

export default store;