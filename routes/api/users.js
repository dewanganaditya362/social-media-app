const express = require('express');
const gravatar = require('gravatar'); // used to set the profile image of the user
const bcrypt = require('bcryptjs');  // used for encryption of password
const jwt = require('jsonwebtoken'); // used for authentication of the users.
const config = require('config');
const router = express.Router();
const { body , validationResult } = require("express-validator"); // these are required to validate whether the person has put correct information in the fields given.

const User = require('../../models/User');

// @route  POST api/users
// @desc   register user
// @access Public
router.post('/',[
    body('name','Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({min : 6})
], async (req, res)=> {
    
    const errors = validationResult(req); // it return the results whether it has any errors or not.

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    const {name , email , password } = req.body;

    try{
    // See if user exists
    let user = await User.findOne({email});

    if(user){
       return res.status(400).json({errors: [ { msg : 'User already exists! ' } ] } );
    }

    //Get users gravatar
    const avatar = gravatar.url(email, {
        s: '200', // s stands for size
        r: 'pg', //r stands for rating and pg: may contain rude gestures, provocatively dressed individuals, the lesser swear words, or mild violence.
        d: 'mm' // d stands for default mm means it will give you a default image.
    });

    user = new User({  // this line of code only creates an instance of user but doesnt save it to the data base.
        name, 
        email, 
        password, 
        avatar
    });

    //Encrypt  password
    const salt = await bcrypt.genSalt(10);  // all the functions that returns a promise, we need to put the async keyword in front of it.

    user.password = await bcrypt.hash(password, salt);

    await user.save(); // this saves all the information of the user to the database.

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