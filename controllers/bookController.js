var Book = require('../models/book');
var BookInstance = require('../models/bookinstance');
var Genre = require('../models/genre');
var Author = require('../models/author');
var async = require('async');

exports.index = function(req, res) {
  async.parallel({
    bookCount: function(callback) { Book.countDocuments({}, callback) },
    stockCount: function(callback) { BookInstance.countDocuments({}, callback) },
    availableCount: function(callback) { BookInstance.countDocuments({status:'Available'}, callback) },
    genreCount: function(callback) { Genre.countDocuments({}, callback) },
    authorCount: function(callback) { Author.countDocuments({}, callback) }
  },
  function(err, results) {
    console.log(err);
    console.log(results);
    res.render('index', {title: 'Local Library', error: err, data: results});
  }
)};

exports.book_list = function(req, res) {
  Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, results) {
      if (err) { return next(err); }
      res.render('book-list', 
                 { title: 'Book List', 
                   book_list: results.sort((a, b) => { return a.title.localeCompare(b.title) }) });
  });
};

exports.book_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

exports.book_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book create GET');
};

exports.book_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book create POST');
};

exports.book_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

exports.book_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

exports.book_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

exports.book_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};