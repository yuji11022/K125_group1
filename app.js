const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const mustacheExpress = require("mustache-express");

app.use(express.urlencoded({ extended: true }));

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');





app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});


app.get('/recipe.html', (req, res) => {
    res.sendFile(__dirname + '/views/recipe.html');
});

app.post('/login', (req, res) => {
    res.send('こんにちは!' + req.body.username);
});

app.get('/newid', (req, res) => {
    res.sendFile(__dirname + '/views/newid.html');
});

app.post('/newregistration', (req, res) => {
    fs.readFile('temp/account.json', function (err, data) {
        let userdata = [];
        if (data === null || data.toString() === '') {
            fs.writeFile('temp/account.json', '', function (err) {
                console.log('failed to write file');
            });
        } else {
            userdata = JSON.parse(data);
        }
        let newuser = {
            userid: req.body.userid,
            password: req.body.password,
            username: req.body.username,
        }
        userdata.push(newuser);
        console.log("アカウント登録完了");
        console.log(req.body.password);
        fs.writeFile('temp/account.json', JSON.stringify(userdata), function (err) {
            res.redirect('/login');
        });

    });
});

app.get('/login', (req, res) => {
    res.render('login.mustache');
});

app.post('/registration', (req, res) => {
    let data = {
        name: req.body.username,
        age: req.body.age,
        description: req.body.description
    }


})

app.use('/static', express.static('static'));

app.listen(port, () => {
    console.log("server activated.");

});