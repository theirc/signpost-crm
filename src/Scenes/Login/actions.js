import { createAction } from 'redux-actions';

const actionTypes = {
	setUser: 'SET_USER',
	setToken: 'SET_TOKEN',
};

export default {
	types: actionTypes,
	setUser: createAction(actionTypes.setUser),
	setToken: createAction(actionTypes.setToken),
};
