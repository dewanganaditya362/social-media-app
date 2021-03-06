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
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
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
     <Route exact path = '/profiles' component = {Profiles}/>
     <Route exact path = '/profile/:id' component = {Profile}/>
     <PrivateRoute exact path = '/dashboard' component = {Dashboard}/>
     <PrivateRoute exact path = '/create-profile' component = {CreateProfile}/>
     <PrivateRoute exact path = '/edit-profile' component = {EditProfile}/>
     <PrivateRoute exact path = '/add-experience' component = {AddExperience}/>
     <PrivateRoute exact path = '/add-education' component = {AddEducation}/>
     <PrivateRoute exact path = '/posts' component = {Posts}/>
     
     </Switch> 
   </section>
   
</Fragment>
</Router>
</Provider>

)};


export default App;
