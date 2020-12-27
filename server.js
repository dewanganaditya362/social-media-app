const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect MongoDB
connectDB();

//Init Middleware
app.use(express.json({ extended:false }));

app.get('/', (req, res)=> res.send('API Running'));

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000; // if we deploy this app in heroku or any other site the process.env.PORT will get activated and
// it will provide the PORT number else if locally using it will open in PORT 5000

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));