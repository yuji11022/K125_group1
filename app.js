const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const mustacheExpress = require("mustache-express");
const session = require('express-session');




app.engine('mustache', mustacheExpress());

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret_key'
}));
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
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
        console.log(req.body.userid);

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

app.post('/verify', (req, res) => {
    fs.readFile('temp/account.json', function (err, dat) {
        if (err) {
            console.error(err);
            res.redirect('/login');
            return;
        }

        let data = [];
        if (dat != undefined && dat.toString() != "") {
            data = JSON.parse(dat.toString());
        }
        console.log(data)

        let success = false;
        for (let account of data) {
            if (account.userid == req.body.userid && account.password) {
                console.log("ログイン成功");
                req.session.userid = account.userid;
                success = true;
                break;
            }
        }

        if (success) {
            res.redirect('/user');
        } else {
            console.log("ログイン失敗");
            res.redirect('/login');
        }
    });
});



app.get('/user', (req, res) => {
    if (req.session.userid == undefined) {
        res.redirect('login');
    } else {
        res.render('user.mustache', {
            userid: req.session.userid
        });
    }
    console.log(req.session.user);
});

app.get('/newpost', (req, res) => {
    res.render('newpost.mustache');
});

app.post('/postregistration', (req, res) => {
    fs.readFile('temp/post.json', function (err, data) {
        let postdata = [];
        if (data === null || data.toString() === '') {
            fs.writeFile('temp/post.json', '', function (err) {
                console.log('failed to write file');
            });
        } else {
            postdata = JSON.parse(data);
        }
        let newpost = {
            posttitle: req.body.posttitle,
            postcontent: req.body.postcontent,
        }
        postdata.push(newpost);
        console.log("投稿の送信が完了しました。");
        console.log(req.body.posttitle);
        console.log(req.body.postcontent);


        fs.writeFile('temp/post.json', JSON.stringify(postdata), function (err) {
            res.redirect('/submit');
            
        });
        
    });
});

app.get('/submit', (req, res) => {
    fs.readFile('temp/post.json',function (err,dat) {
        let myArr = [];
         if(dat.toString() !=""){
         myArr = JSON.parse(dat.toString());
        }
      res.render('recipe.mustache',
    {myArr,myArr});
     })
});

app.get('/recipe', (req, res) => {
    fs.readFile('temp/post.json', function (err, dat) {
        let myArr = [];
        var idx = 0;
        if (dat.toString() != "") {
            myArr = JSON.parse(dat.toString());
        }
        res.render('recipe.mustache', {
            myArr,
            myArr,
            userid: req.session.userid,
            idx: function() {
                return idx++;
            }
        
        });
    });
    function bookmark(i) {
        fs.readFile('temp/post.json', function (err, dat) {
            console.log(dat[i]);

        });
    };
});

app.get('/logout', (req, res) => {
    req.session.userid = undefined;
    res.redirect('/');
});

app.use('/static', express.static('static'));

app.listen(port, () => {
    console.log("server activated.");

});




  






