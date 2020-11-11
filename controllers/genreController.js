var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
var { body, validationResult } = require('express-validator');

exports.genre_list = function(req, res) {
  Genre.find()
  .sort([['name','ascending']])
  .exec(function (err, results) {
    if (err) { return next(err); }
    res.render('genre-list', 
               { title: 'Genres', genre_list: results });
  });
};

exports.genre_detail = function(req, res) {
  async.parallel({
    genre: function(callback) { Genre.findById(req.params.id).exec(callback) },
    books: function(callback) { Book.find({genre: req.params.id}).exec(callback) },
  },
  function(err, results) {
    if (err) { return next(err); }
    const noBooks = results.books.length === 0 ? 'No Books for ' + results.genre.name : '';
    res.render('genre-detail', 
               {title: 'Genre: ' + results.genre.name, error: err, genre_detail: results, no_books: noBooks});
  }
  );
};

exports.genre_create_get = function(req, res) {
  res.render('create-form', {
    title: 'Create Genre',
    fields: [{ name: 'name', label: 'Genre', type: 'text', default: '' }],
    errors: []
  });
};

exports.genre_create_post = [
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
  (req, res) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });
    if (!errors.isEmpty()) {
      res.render('create-form', {
        title: 'Create Genre',
        fields: [{ name: 'name', label: 'Genre', type: 'text', default: req.body.name }],
        errors: errors.array()
      });
      return;
    } else {
      Genre.findOne({ name: req.body.name })
        .exec(function (err, found) { 
          if (err) { return next(err); }  
          if (found) {
            res.redirect(found.url);
          } else {
            genre.save(function (err) {
              if (err) return next(err);
              res.redirect(genre.url);
            });
          }
        });
    }
  }
];

exports.genre_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: genre delete GET');
};

exports.genre_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: genre delete POST');
};

exports.genre_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: genre update GET');
};

exports.genre_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: genre update POST');
};