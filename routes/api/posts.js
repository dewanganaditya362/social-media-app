const express = require('express');
const {body , validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const router = express.Router();

// @route  POST api/posts
// @desc   Create a post
// @access Private

router.post('/', [auth, [
    body('text', 'Text is required').not().isEmpty()
]
],  

async (req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password'); // in this way the password doesnt gets sent.

        const newPost = new Post( {
        text : req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
        });

        const post = await newPost.save();

        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }

});


// @route  GET api/posts
// @desc   Get all post
// @access Private

router.get('/', auth , async (req, res) =>{     //auth middleware basically protects the route , you should add it only when the access is supposed to be private else no need to add it if the route is public
    try {
        const post = await Post.find().sort({date : -1});
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});  

// @route  GET api/posts/:id
// @desc   Get post by id
// @access Private

router.get('/:id', auth , async (req, res) =>{ // auth middleware basically protects the route , you should add it only when the access is supposed to be private else no need to add it if the route is public
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg: 'Post Not Found!'});
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post Not Found!'});
        }
        res.status(500).send('Server Error!');
    }
});  

// @route  DELETE api/posts/:id
// @desc   Get all post
// @access Private

router.delete('/:id', auth , async (req, res) =>{  // auth middleware basically protects the route , you should add it only when the access is supposed to be private else no need to add it if the route is public
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg: 'Post Not Found!'});
        }
        
        //check user
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg : 'User not authorized'});
        }

        await post.remove();

        res.json({ msg : 'Post removed!'});

    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post Not Found!'});
        }
        res.status(500).send('Server Error!');
    }
});  

// @route  PUT api/posts/like/:id
// @desc   Like a post
// @access Private

router.put('/like/:id', auth , async(req, res)=>{

    try {
        const post = await Post.findById(req.params.id);

        //Check if the post has already been liked
        if(post.likes.filter(like => like.user.toString()=== req.user.id).length > 0){
            return res.status(400).json({ msg : 'Post already liked' });
        }

        post.likes.unshift({ user : req.user.id});

        await post.save();

        res.json(post.likes);


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route  PUT api/posts/unlike/:id
// @desc   unlike a post
// @access Private

router.put('/unlike/:id', auth , async(req, res)=>{

    try {
        const post = await Post.findById(req.params.id);

        //Check if the post has already been liked
        if(post.likes.filter(like => like.user.toString()=== req.user.id).length === 0){
            return res.status(400).json({ msg : 'Post has not yet been liked' });
        }

        //Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route  POST api/posts/comment/:id
// @desc   Comment on a post
// @access Private

router.post('/comment/:id', [auth, 
[
    body('text', 'Text is required').not().isEmpty()
]
],  

async (req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password'); // in this way the password doesnt gets sent.

        const post = await Post.findById(req.params.id);

        const newComment = ({
        text : req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
        });

        post.comments.unshift(newComment);
        await post.save();

        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }

});

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   DELETE a comment
// @access Private

router.delete('/comment/:id/:comment_id', auth , async (req, res)=>{
    try {
        
        const post = await Post.findById(req.params.id);

        // Pull out comment
        const comment = post.comments.find(comment=> comment.id === req.params.comment_id);

        // Make sure comment exists
        if(!comment){
            return res.status(404).json({msg : 'Comment does not exists'});
        }

        //Check whether the user who is deleting the comment is the one who made it.

        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({ msg : 'User not Authorized'});
        }

        //Get remove Index
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;