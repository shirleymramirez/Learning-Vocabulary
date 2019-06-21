const knex = require("../db/knex.js");
const translate = require('../config/GoogleAPI.js');
const languageMap = {  'tl': 'Tagalog/Filipino',  'de': 'Deutsch',  'fr': 'Français',  'pt': 'Português',  'es': 'Español',  'tr': 'Türk', 'nl': 'Nederlands',  'it': 'Italiano',  'pl': 'Polski',  'ro': 'Român',  'sv': 'Svensk',  'vi': 'Việt',  'bs': 'Bosanski',  'ca': 'Català',  'hr': 'Hrvatski',  'dq': 'Dansk',  'eo': 'Esperanto',  'fi': 'Suomalainen',  'ht': 'Haian kreyòl',  'hu': 'Magyar',  'is': 'Icelandic',  'id': 'Indonesia',  'la': 'Latinum',  'lv': 'Latvijas',  'no': 'Norsk',  'sk': 'Slovenský',  'sw': 'Kiswahili',  'cy': 'Cymraeg'}

module.exports = {

  index: function(req, res) {
    res.render('index', {user: req.session.user});
  },

  loginPage: function(req, res) {
    res.render('login');
  },

  login: async function(req,res){
    const userArr = await knex("users").where({email: req.body.email})
    var user = userArr[0];
    if(user && user.password === req.body.password){
        await knex("users")
              .where({email: req.body.email})
              .update({language: req.body.language.substr(0,2)})
        let rows = await knex("users")
                              .where({email: req.body.email})
        let currUser=rows[0];
        req.session.user = currUser;
        req.session.save(err=>{
          if(err){
            console.error(err);
          }
          knex("words")
          .where({user_id:req.session.user.id})
          .where({language: req.session.user.language})
          .increment('count',-5)
          .then(()=>{
            knex("words")
            .where({user_id:req.session.user.id})
            .where({language: req.session.user.language})
            .where('count','<',0)
            .update({count: 0})
            .then(()=>{
              res.redirect("/");
            })
            .catch(err=>console.log(err));
          })
          .catch(error=>console.log(error));
        })
    }
    else{
      res.redirect("/");
    }
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
      language: req.body.language.substring(0,2)
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

  trainingPage: async function(req,res){
    // get words from the database based on user's input word
    const testBank = await knex('words')
                          .orderBy('count', 'asc')
                          .where({language: req.session.user.language})
                          .where({ user_id: req.session.user.id })
    if(testBank.length==0){
        res.redirect('/')//may want to make a new route for this because they don't know why they got kicked out
    }
    else{
      const greenWordsArr = await knex('words')
                                  .where({ user_id: req.session.user.id })
                                  .where({language: req.session.user.language})
                                  .where('count','>',99)
      const greenWords = greenWordsArr.length
      const yellowWordsArr = await knex('words')
                                  .where({ user_id: req.session.user.id })
                                  .where({language: req.session.user.language})
                                  .where('count','<=',99)
                                  .where('count','>', 50)
      const yellowWords = yellowWordsArr.length
      const redWordsArr = await knex('words')
                                  .where({ user_id: req.session.user.id })
                                  .where({language: req.session.user.language})
                                  .where('count','<=', 50)
      const redWords = redWordsArr.length;
      const allWordsArr = await knex('words')
                                .where({language: req.session.user.language})
                                .where({ user_id: req.session.user.id })
      const totalWords = allWordsArr.length
      if(redWords>0){
        Math.random()
      }
      res.render('train', { 
        translatedWord: testBank[0] , 
        greenWords: greenWords, 
        redWords: redWords, 
        yellowWords: yellowWords,
        totalWords: totalWords
      });
    }
  },

  wordForm: function(req,res){
    //if they haven't done the post request, we'll pass an empty string
    knex("words")
    .where({user_id: req.session.user.id})
    .where({language: req.session.user.language})
    .then(result=>{//result is an array of objects
      res.render('newWord',{ translatedWord: "...", engWord: "type your word here", dictionary: result, language: languageMap[req.session.user.language] })
    })
  },
  newWord: async function(req,res){
    const result = await knex("words")
                          .where({user_id: req.session.user.id})
                          .where({language: req.session.user.language})//this should load the page with only words from the current session language??? not working
                          .catch(err=>console.log(err))
    const word =req.body.inputWord
    const language= req.session.user.language
    const newWord = await translate(word, language).catch(err=>console.log(err))

    res.render('newWord', {translatedWord:newWord, engWord:word, dictionary:result, language: req.session.user.language})

  },
  saveWord: function(req, res){
    let translatedWord = req.body.outputWord;
    if(translatedWord=="..."){
      res.redirect('/newWord')
    }
    else{
      let englishWord = req.body.inputWord;
      knex("users").where({email: req.session.user.email}).then(rows=>{
        let userID = rows[0].id;
        knex("words").insert({//should check if we already have the word & same translation in db
          word: englishWord,
          translation: translatedWord,
          user_id: userID,
          language: req.session.user.language,
          count: 50,
          status: 'blue'
        }).then(result=>{
          res.redirect('/newWord');
        })
        .catch(err=>console.log(err));
      })
      .catch(err=>console.log(err));
    }
  },
  updateWord: function (req,res){
    let wordId = req.body.newWordID;
    let newEngWord = req.body.newEnglishWord;
    let newTranslWord = req.body.newTranslatedWord;
    knex('words').where({id: wordId}).update({
      word: newEngWord,
      translation: newTranslWord
    })
    .catch(err=> console.log(err));
    res.redirect('/newWord')
  },
  deleteWord: function(req,res){
    let idToDelete = req.body.deleteID;
    knex('words').where({id: idToDelete}).del().then(()=>{
      res.redirect('/newWord')
    })
  },
  train: function(req,res){
      if (req.body.inputWord === req.body.answer ) {
        knex('words').where({id: req.body.hiddenWord}).then(rows=>{
          knex('words')
            .where({id: req.body.hiddenWord})
            .update({
              count: rows[0].count<=80 ? rows[0].count+20: 100,
            })
            .update('updated_at', knex.fn.now())
            .then(result=>{
              req.session.save(function(err){
                if(err){
                  console.error(err);
                }
                res.redirect("/train");
      
              })
            })
            .catch(err=>console.log(err));        
        })
      }
      else{
        knex('words')
          .where({id: req.body.hiddenWord})
          .then(rows=>{
            knex('words')
              .where({id: req.body.hiddenWord})
              .update({
                count: rows[0].count>=10 ? rows[0].count-10: 0,
              })
              .update('updated_at', knex.fn.now())
              .catch(err=>console.log(err));
            req.session.save(function(err){
              if(err){
                console.error(err);
              }
              res.redirect("/train");
            })
          })
          .catch(err=>console.log(err));
          
      }
  },
  logout: function(req,res){
    req.session.destroy()
    res.redirect('/')
  }
}
