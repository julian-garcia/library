var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
var { body, validationResult } = require('express-validator');

exports.bookinstance_list = function(req, res) {
    BookInstance.find()
      .populate('book')
      .exec(function (err, results) {
        if (err) { return next(err); }
        res.render('book-stock', 
                   { title: 'Book Stock', 
                     book_stock: results
                      .sort((a, b) => { return a.book.title.localeCompare(b.book.title) }) 
                   });
      });
};

exports.bookinstance_detail = function(req, res) {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, results) {
      if (err) { return next(err); }
      res.render('book-stock-detail', 
                  { title: 'Stock for: ' + results.book.title, 
                    book_stock_detail: results });
    });
};

exports.bookinstance_create_get = function (req, res) {
  Book.find()
  .exec(function (err, results) {
    if (err) { return next(err); }
    res.render('create-form', 
      {
        title: 'Add Stock',
        fields: [
          {
            name: 'book', label: 'Book', type: 'select', default: '',
            content: results.sort((a, b) => { return a.title.localeCompare(b.title) })
          },
          { name: 'imprint', label: 'Imprint', type: 'text', default: '' },
          { name: 'due_back', label: 'Due Back', type: 'date', default: '' },
          {
            name: 'status', label: 'Status', type: 'select', default: '',
            content: ['Available', 'Maintenance', 'Loaned', 'Reserved']
          }
        ],
        errors: []
      });
  });
};

exports.bookinstance_create_post = [
  body('book', 'Book required').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint required').trim().isLength({ min: 1 }).escape(),
  body('due_back', 'Due date required').trim().isLength({ min: 1 }).escape(),
  body('due_back', 'Invalid due date').optional({checkFalsy: true}).isISO8601().toDate(),
  body('status', 'Status required').trim().isLength({ min: 1 }).escape(),
  (req, res) => { 
    const errors = validationResult(req);
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      due_back: req.body.due_back,
      status: req.body.status
    });
    if (!errors.isEmpty()) {
      Book.find()
      .exec(function (err, results) {
        if (err) { return next(err); }
        const mth = req.body.due_back.getMonth() + 1;
        const day = req.body.due_back.getDate();
        const formattedDueBack = `${req.body.due_back.getFullYear()}-${mth <= 9 ? '0' :''}${mth}-${day <= 9 ? '0' :''}${day}`;
        res.render('create-form', 
          {
            title: 'Add Stock',
            fields: [
              {
                name: 'book', label: 'Book', type: 'select', default: req.body.book.trim(),
                content: results.sort((a, b) => { return a.title.localeCompare(b.title) })
              },
              { name: 'imprint', label: 'Imprint', type: 'text', default: req.body.imprint },
              { name: 'due_back', label: 'Due Back', type: 'date', default: formattedDueBack },
              {
                name: 'status', label: 'Status', type: 'select', default: req.body.status,
                content: ['Available', 'Maintenance', 'Loaned', 'Reserved']
              }
            ],
            errors: errors.array()
          });
      });
    } else {
      BookInstance.findOne({ book: req.body.book, due_back: req.body.due_back })
        .exec(function (err, found) { 
          if (err) { return next(err); }  
          if (found) {
            res.redirect(found.url);
          } else {
            bookInstance.save(function (err) {
              if (err) return next(err);
              res.redirect(bookInstance.url);
            });
          }
        });
    }
  }
];

exports.bookinstance_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

exports.bookinstance_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

exports.bookinstance_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

exports.bookinstance_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};