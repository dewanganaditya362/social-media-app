import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteAccount, getCurrentProfile } from '../../actions/profile';
//
import { Link } from 'react-router-dom';
import axios from 'axios';
import { setAlert } from '../../actions/alert';
import Spinner from '../layout/Spinner';
import DasboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';


const Dashboard = ({ getCurrentProfile, deleteAccount,  auth :{user}, profile : {profile , loading } }) => {
    
    useEffect(() => {
        getCurrentProfile();
    }, []);    // the second parameter i.e. [] , is used so that the useEffect function runs only once.
    
    return loading && profile === null ? (<Spinner/>) : (<Fragment>
        <h1 className = "large text-primary">Dashboard</h1>
        <p className= "lead">
            <i className = "fas fa-user"></i>
            Welcome! {user && user.name}
        </p>
        { profile !== null ? ( <Fragment><DasboardActions/>
        <Experience experience = {profile.experience}/>
        <Education education = {profile.education}/>

        <div className="my-2">
            <button className="btn btn-danger" onClick = { () => deleteAccount() }>
                <i className = "fas fa-user-minus"></i> Delete My Account
            </button>
        </div>
        </Fragment> ) : 
       (<Fragment>
            <p>
                You have not yet setup a profile , please add some info
            </p>
            <Link to = '/create-profile' className = '"btn btn-primary my-1'>
                Create Profile
            </Link>

        </Fragment>) }
    </Fragment>);
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth : PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth : state.auth,
    profile : state.profile
    
});

export default connect(mapStateToProps, { getCurrentProfile , deleteAccount })(Dashboard);
