const knex = require("../db/knex.js");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: function(req, res) {
    res.render('index', {user: req.session.user});
  },
  login: function(req,res){
    knex("users").where({email: req.body.email})
    .then((rows)=>{
      var user = rows[0];
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
  trainingPage: function(req,res){
    res.render('train')
  },
  wordForm: function(req,res){
    res.render('newWord')
  },
  newWord: function(req,res){

  },
  train: function(req,res){

  },
  logout: function(req,res){

  }
}
