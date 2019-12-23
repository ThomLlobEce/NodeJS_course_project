const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const users = []
const auths = []

const port = process.env.PORT || 5000;

app.use(bodyParser.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.post('/api/createUser', (req,res) => {
    let exist = false
    let missingParams = false;

    if(!req.body.email || !req.body.first_name || !req.body.last_name || !req.body.password){
        missingParams = true
    }
    else{
        for(let i = 0; i < users.length; i++){
            if(users[i].email === req.body.email){
                exist = true
                break
            }
        }
    }
    
    if(exist){
        res.json({
            status: "failed",
            message: "Email already exists"
        })
    }
    else if(missingParams){
        res.json({
            status: "failed",
            message: "Missing parameters"
        })
    }
    else{
        users.push({name: req.body.last_name, firstName: req.body.first_name, email: req.body.email, password: req.body.password})
        res.json({
            status: "success",
            message: "User added"
          });
    }
});

app.get('/api/signIn', (req,res) => {
    let user = false
    let exist = false

    for(let i = 0; i < users.length; i++){
        if(users[i].email === req.query.email && users[i].password === req.query.password){
            for(let j = 0; j < auths.length; j++){
                if(auths[j] = users[i].email){
                    console.log("auths : "+ auths[j])
                    console.log("email : "+ email[i])
                    exist = true
                    break
                }
            }
            if(!exist){
                user = users[i]
                auths.push(users[i].email)
            }
            break
        }
    }

    if(user){
        res.json({ status: "success", message: user });
    }
    else if(exist){
        res.json({ status: "failed", message: "Already signed in" });
    }
    else{
        res.json({ status: "failed", message: "error" });
    }
});

app.get('/api/isAuth', (req, res) => {
    let auth = false

    for(let i = 0; i < auths.length ; i++){
        if(auths[i] === req.query.email){
            auth = true
        }
    }

    if(auth){
        res.json({ status: "success", message: auth });
    }
    else{
        res.json({ status: "failed", message: auth });
    }

});

app.get('/api/disconnect', (req, res) => {
    let disconnect = false

    for(let i = 0; i < auths.length ; i++){
        if(auths[i] === req.query.email){
            auths.splice(i, 1)
            disconnect = true
        }
    }

    if(disconnect){
        res.json({ status: "success", message: disconnect });
    }
    else{
        res.json({ status: "failed", message: disconnect });
    }

});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port);

console.log('App is listening on port ' + port);

module.exports = app