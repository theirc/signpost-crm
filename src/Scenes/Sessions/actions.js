import { createAction } from 'redux-actions';

const actionTypes = {
	saveSession: 'CREATE_SESSION',
};

export default {
	types: actionTypes,
	saveSession: createAction(actionTypes.saveSession),
};
