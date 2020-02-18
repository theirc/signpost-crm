import actions from './actions';

const initialState = {
     user: null,
     token: null,
}

const loginReducers = (state = initialState, action) => {
    switch(action.type){
        case actions.types.setUser:
            return { ...state, user: action.payload};
        case actions.types.setToken:
            return { ...state, token: action.payload};
        default:
            return state;
    }
}

export default loginReducers;
