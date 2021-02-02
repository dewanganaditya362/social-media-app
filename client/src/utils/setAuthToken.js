//this utility function is basically made for the purpose of setting the authentication token as a global header (if its present there)
// and if the header is not present we simply delete it.
import axios from 'axios';


const setAuthToken = token =>{

    if(token){
        axios.defaults.headers.common['x-auth-token'] = token;

    }
    else{
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken;