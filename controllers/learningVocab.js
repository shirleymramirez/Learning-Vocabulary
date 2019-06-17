const knex = require("../db/knex.js");

module.exports = {
  index: function(req, res) {
    res.render('index', {user: req.session.user});
  },
  loginPage: function(req, res) {
    res.render('login');
  },
  login: function(req,res){
    knex("users").where({email: req.body.email})
    .then((rows)=>{
      var user = rows[0];
      console.log(user);
      console.log(req.body.password);
      if(user && user.password === req.body.password){
        req.session.user = user;
      }
      res.redirect("/");
    })
    .catch(err=>{
      console.log(err);
    })
  },
  register: function(req,res){
    res.render('register');
  },
  newUser: function(req,res){
    if(req.body.password!=req.body.confirmpass){
      res.redirect("/register");
      return;
    }
    knex("users").insert({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    .then(()=>{
      knex("users").where({email: req.body.email})
      .then((rows)=>{
        var user = rows[0];
        req.session.user = user;
        res.redirect("/");
      })
      .catch(err=>{
        console.log(err);
      })
    })
    .catch(err=>{
      console.log(err);
    })
  },
  trainingPage: function(req,res){
    res.render('train')
  },
  wordForm: function(req,res){
    //if they haven't done the post request, we'll pass an empty string
    let word = "..."
    res.render('newWord')
  },
  newWord: function(req,res){
    //if they just did a post request, we rerender newWord and pass it the result from API
    let newWord="google API result";
    res.render('newWord', word=newWord)
  },
  saveWord: function(req, res){

  },
  train: function(req,res){
    
  },
  logout: function(req,res){

  }
}
