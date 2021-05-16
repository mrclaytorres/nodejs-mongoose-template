var express = require('express');
var router = express.Router();

//define environment variables
const dotenv = require('dotenv');
dotenv.config();

var mongoose = require('mongoose');
//Prevent Deprecation warning
mongoose.set('useNewUrlParser', true);

mongoose.connect('mongodb://localhost:' + process.env.DBPORT + '/' +  process.env.DATABASENAME);
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
  title: {type: String, required: true},
  content: String,
  author: String
}, {collection: 'user-data'});

var UserData = mongoose.model('UserData', userDataSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next){
  
  UserData.find({}).lean()
    .exec(function(err, doc){
      
      if (err){
        console.log('Error, data does not exist.');
      }
      res.render('index', {items: doc});
    });

});

router.post('/insert', function(req, res, next){
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  var data = new UserData(item);
  data.save();

  res.redirect('/');
});

router.post('/update', function(req, res, next){
  var id = req.body.id

  UserData.findById(id, function(err, doc){
    if (err){
      console.log('error, no entry found.');
    }

    doc.title = req.body.title;
    doc.content = req.body.content,
    doc.author = req.body.author;
    doc.save();
  });

  res.redirect('/');
});

router.post('/delete', function(req, res, next){
  var id = req.body.id

  UserData.findByIdAndDelete(id).exec();

  res.redirect('/');
});

module.exports = router;