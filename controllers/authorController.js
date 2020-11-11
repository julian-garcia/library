var Author = require('../models/author');
var Book = require('../models/book');
var async = require('async');
var { body, validationResult } = require('express-validator');

exports.author_list = function(req, res) {
  Author.find()
  .sort([['family_name','ascending']])
  .exec(function (err, results) {
    if (err) { return next(err); }
    res.render('author-list', 
               { title: 'Authors', author_list: results });
  });
};

exports.author_detail = function(req, res) {
  async.parallel({
    author: function(callback) { Author.findById(req.params.id).exec(callback) },
    books: function(callback) { Book.find({author: req.params.id}).exec(callback) },
  },
  function(err, results) {
    if (err) { return next(err); }
    res.render('author-detail', 
               {title: 'Author: ' + results.author.first_name, error: err, author_detail: results});
  }
  );
};

exports.author_create_get = function(req, res) {
  res.render('create-form', {
    title: 'Create Author',
    fields: [
      { name: 'first_name', label: 'First Name', type: 'text', default: '' },
      { name: 'family_name', label: 'Family Name', type: 'text', default: '' },
      { name: 'date_of_birth', label: 'Date of birth', type: 'date', default: '' },
      { name: 'date_of_death', label: 'Date of death', type: 'date', default: '' }
    ],
    errors: []
  });
};

exports.author_create_post = [
  body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name required'),
  body('family_name', 'Family name required').trim().isLength({ min: 1 }).escape(),
  body('date_of_birth', 'Birth date required').trim().isLength({ min: 1 }).escape(),
  body('date_of_birth', 'Invalid birth date').optional({checkFalsy: true}).isISO8601().toDate(),
  body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601().toDate(),
  (req, res) => {
    const errors = validationResult(req);
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death
    });
    if (!errors.isEmpty()) {
      res.render('create-form', {
        title: 'Create Author',
        fields: [
          { name: 'first_name', label: 'First Name', type: 'text', default: req.body.first_name },
          { name: 'family_name', label: 'Family Name', type: 'text', default: req.body.family_name },
          { name: 'date_of_birth', label: 'Date of birth', type: 'date', default: req.body.date_of_birth },
          { name: 'date_of_death', label: 'Date of death', type: 'date', default: req.body.date_of_death }
        ],
        errors: errors.array()
      });
      return;
    } else {
      Author.findOne({ first_name: req.body.first_name, family_name: req.body.family_name })
        .exec(function (err, found) { 
          if (err) { return next(err); }  
          if (found) {
            res.redirect(found.url);
          } else {
            author.save(function (err) {
              if (err) return next(err);
              res.redirect(author.url);
            });
          }
        });
    }
  }
];

exports.author_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete GET');
};

exports.author_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete POST');
};

exports.author_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

exports.author_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update POST');
};