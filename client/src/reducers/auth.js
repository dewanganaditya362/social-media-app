import 
{ 
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL, 
    LOGOUT
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated : null ,
    loading : true,
    user : null
}

export default function foo(state = initialState, action){
    
    const { type, payload } = action;
    
    switch(type){
        case USER_LOADED :
            return {
                ...state,
                isAuthenticated : true,
                loading : false,
                user : payload
            }

        case REGISTER_SUCCESS : 
        case LOGIN_SUCCESS :
        localStorage.setItem('token', payload.token);    //after registeration is successful then this line of code sets the token to payload.token which is its actual value.
        return{
            ...state, 
            ...payload, 
            isAuthenticated : true, 
            loading : false
        }

        case REGISTER_FAIL:
        case AUTH_ERROR: 
        case LOGIN_FAIL:
        case LOGOUT: 
            localStorage.removeItem('token');   // SO if the registration is a failure then we need to remove the token. 
            return {
                ...state, 
                 token : null, 
                 isAuthenticated : false , 
                 loading : false
            } 

        default: 
        return state;
    }
}