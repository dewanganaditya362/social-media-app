const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { body , validationResult} = require("express-validator"); 
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// @route  GET api/auth
// @desc   Test route
// @access Public
router.get('/', auth , async (req, res)=> {  // adding auth as a parameter makes this route protected.
    try{
        const user = await User.findById(req.user.id).select('-password'); // this gets the id as in the auth.js middleware, we have written req.user = decoded.user; which helps in getting the id and we dont want the password so we have written .select('-password'); 
        res.json(user);
    }

    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}); 

// @route  POST api/auth
// @desc   Authenticate user & get token
// @access Public
router.post('/',[
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
], async (req, res)=> {
    const errors = validationResult(req); // it return the results whether it has any errors or not.

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    const {email , password } = req.body;

    try{
    // See if user exists
    let user = await User.findOne({email});

    if(!user){
       return res.status(400).json({errors: [ { msg : 'Invalid Credentials!' } ] } );
    }


    const isMatch = await bcrypt.compare(password , user.password); // compares the given password with encrypted password
    
    if(!isMatch){
        return res.status(400).json({errors: [ { msg : 'Invalid Credentials!' } ] } );
    }

    //Return jsonwebtoken
    const payload  = {
        user: {
            id : user.id
        }
    }

    jwt.sign(payload, config.get('jwtSecret'),
    (err, token) => {
        if(err) throw err;
        res.json({token});
    }
    );


    

    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
    
});

module.exports = router;