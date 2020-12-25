const express = require('express');

const app = express();

app.get('/', (req, res)=> res.send('API Running'));

const PORT = process.env.PORT || 5000; // if we deploy this app in heroku or any other site the process.env.PORT will get activated and
// it will provide the PORT number else if locally using it will open in PORT 5000

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));