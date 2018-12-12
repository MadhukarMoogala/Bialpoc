const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');

const PORT = process.env.PORT || 3000;
const config = require('./config');
console.log(config);
if (config.credentials.client_id === null || config.credentials.client_secret === null) {
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    return;
}

let app =express();

//adds express middleware layers to express middleware stack
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieSession({
    name:'forge-session',
    keys:['forge_secure_key'],
    maxAge:14*24*60*60*1000
}));
app.use(express.json({limit:'50mb'}));
app.use('/api/forge', require('./routes/oauth'));
app.use('/api/forge', require('./routes/datamanagement'));
app.use('/api/forge', require('./routes/user'));
app.use((err,req,res,next)=>{
    console.error(err);
    res.status(err.statusCode).json(err);
});


app.listen(PORT, ()=>{
    console.log(`Server Listening on Port ${PORT}`);
});