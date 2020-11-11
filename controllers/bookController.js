var Book = require('../models/book');
var BookInstance = require('../models/bookinstance');
var Genre = require('../models/genre');
var Author = require('../models/author');
var async = require('async');
var { body, validationResult } = require('express-validator');

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
  async.parallel({
    book: function(callback) { 
            Book.findById(req.params.id)
            .populate('author')
            .populate('genre')
            .exec(callback) },
    stock: function(callback) { BookInstance.find({book: req.params.id}).exec(callback) },
  },
  function(err, results) {
    if (err) { return next(err); }
    res.render('book-detail', 
               {title: results.book.title, error: err, book_detail: results});
  }
  );
};

exports.book_create_get = function(req, res) {
  Book.find()
    .exec(function (err, results) {
      if (err) { return next(err); }
      res.render('create-form', 
        {
          title: 'Add Book',
          fields: [
            { name: 'title', label: 'Title', type: 'text', default: '' },
            { name: 'isbn', label: 'ISBN', type: 'text', default: '' },
            { name: 'summary', label: 'Summary', type: 'textarea', default: '' }
          ],
          errors: []
        });
    });
};

exports.book_create_post = [
  body('title', 'Book title required').trim().isLength({ min: 1 }).escape(),
  body('isbn', 'ISBN required').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary required').trim().isLength({ min: 1 }).escape(),
  body('author', 'Author required').trim().isLength({ min: 1 }).escape(),
  body('genre', 'Genre required').trim().isLength({ min: 1 }).escape(),
  (req, res) => { 
    const errors = validationResult(req);
    const book = new Book({
      title: req.body.title,
      isbn: req.body.isbn,
      summary: req.body.summary,
      author: req.body.author,
      genre: req.body.genre
    });
    if (!errors.isEmpty()) {
      async.parallel({
        authors: function (callback) { Author.find(callback) },
        genres: function (callback) { Genre.find(callback) }
      }, function (err, results) {
          res.render('create-form', {
            title: 'Add Book',
            fields: [
              { name: 'title', label: 'Title', type: 'text', default: req.body.title },
              { name: 'isbn', label: 'ISBN', type: 'text', default: req.body.isbn },
              { name: 'summary', label: 'Summary', type: 'textarea', default: req.body.summary },
              {
                name: 'author', label: 'Author', type: 'select', default: '',
                content: results.authors.sort((a, b) => { return a.first_name.localeCompare(b.first_name) })
              },
              {
                name: 'genre', label: 'Genre', type: 'select', default: '',
                content: results.genres.sort((a, b) => { return a.name.localeCompare(b.name) })
              }
            ],
            errors: errors.array()
          });
          return;
      });
    } else {
      Book.findOne({ title: req.body.title })
        .exec(function (err, found) { 
          if (err) { return next(err); }  
          if (found) {
            res.redirect(found.url);
          } else {
            book.save(function (err) {
              if (err) return next(err);
              res.redirect(book.url);
            });
          }
        });
    }
  }
];

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