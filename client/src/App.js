import React ,{ Fragment , useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Alert from './components/layout/Alert';
import './App.css';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';

// redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import CreateProfile from './components/profile-forms/CreateProfile';

if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => { 
  
  useEffect( ()=> {
      store.dispatch(loadUser());
  }, []);  // this useEffects is a React Hook which will run in a continuous loop every time the state updates, and when we add [] this as a second parameter then it only runs once.
   
  return(
<Provider store = {store}>
<Router>
<Fragment>  
    <Navbar/>         
   <Route exact path = '/' component = {Landing}/>
   <section className = "container">
     <Alert/>
     <Switch>
     <Route exact path = '/register' component = {Register}/>
     <Route exact path = '/login' component = {Login}/>
     <PrivateRoute exact path = '/dashboard' component = {Dashboard}/>
     <PrivateRoute exact path = '/create-profile' component = {CreateProfile}/>
     </Switch> 
   </section>
   
</Fragment>
</Router>
</Provider>

)};


export default App;
