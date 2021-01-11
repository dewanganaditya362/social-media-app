import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import PropTypes from 'prop-types'

//import axios from 'axios';


const Register = ({setAlert}) => {   // the props are sent by actions under alert.

    const [formData, setFormData] = useState({
        name : '',
        email: '',
        password : '',
        password2 : ''
    });
    
    const { name , email , password , password2 } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name] : e.target.value });

    const onSubmit = async e=> {
        e.preventDefault();
        if(password !== password2){
            setAlert('Passwords do not Match!','danger');   // first parameter is message and the second parameter is alertType ; Also danger is passed as a second parameter because we have css styles for different alertType ,which means we have green for success, red for danger and soo on. 
        }
        else{
            console.log("Success");
        }
    } 

    return <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit = { e=> onSubmit(e)}>
        <div className="form-group">
          <input 
          type="text" 
          placeholder="Name" 
          name="name" 
          value = {name} 
          onChange = {e => onChange(e)}
          required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value = {email} 
          onChange = {e => onChange(e)}
          required />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value = {password} 
          onChange = {e => onChange(e)}
          required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value = {password2} 
          onChange = {e => onChange(e)}
          required
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>;
    
    
};

Register.propTypes = {
  setAlert : PropTypes.func.isRequired
};

export default connect(null, { setAlert })(Register);    //this is how we export while using react-redux ; Also connect takes in two parameters(search at the time of revision!)


/* this is one way to send post request and receive a token with the help of axios.

 const onSubmit = async e=> {
        e.preventDefault();
        if(password !== password2){
            console.log('Passwords do not Match!');
        }
        else{
            
            const newUser = { 
                name, 
                email, 
                password
            }

            try {
                const config = {
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                }

                const body = JSON.stringify(newUser);

                const res = await axios.post('/api/users', body, config);   // we are typing only /api/users as we have added proxy in package.json
                console.log(res.data);     
            } catch (err) {
                console.error(err.message);
            }
        }
    }
     
    */