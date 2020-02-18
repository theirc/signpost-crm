import actions from './actions';
import settings from '../../shared/settings';

const initialState = {
	language: 'en-US',
	logoutTimeout: 10,
};

const settingsReducers = (state = initialState, action) => {
	switch (action.type) {
		case actions.types.setLanguage:
			settings.logger.reducers && console.log('settingsReducers::setLanguage');
			return { ...state, language: action.payload };

		case actions.types.setLogoutTimeout:
			settings.logger.reducers && console.log('settingsReducers::setLogoutTimeout');
			return { ...state, logoutTimeout: action.payload };

		default:
			return state;
	}
};

export default settingsReducers;
