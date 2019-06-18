const knex = require("../db/knex.js");
const translator = require('../config/GoogleAPI.js');

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
    res.render('train', { user: req.session.user });
  },
  wordForm: function(req,res){
    //if they haven't done the post request, we'll pass an empty string
    res.render('newWord',{translatedWord: "...", engWord: "type your word here"})
  },
  newWord: function(req,res){
    //if they just did a post request, we rerender newWord and pass it the result from API
    async function getWord(word =req.body.inputWord,language= "es"){
      let newWord = await translator(word,language)
      res.render('newWord', {translatedWord:newWord, engWord:word})
    }
    getWord();

  },
  saveWord: function(req, res){
    let translatedWord = req.body.outputWord;
    let englishWord = req.body.inputWord;
    knex("users").where({email: req.session.user.email}).then(rows=>{
      let userID = rows[0].id;
      knex("words").insert({
        word: englishWord,
        translation: translatedWord,
        user_id: userID,
        language: 'Spanish',
        status: 'yellow'
      }).then(result=>{
        res.redirect('/');
      })
      .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
  },
  train: function(req,res){
    res.redirect("train");
  },

  logout: function(req,res){

  }
}
