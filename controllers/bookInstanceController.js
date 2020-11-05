var BookInstance = require('../models/bookinstance');

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
  res.send('NOT IMPLEMENTED: BookInstance detail: ' + req.params.id);
};

exports.bookinstance_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance create GET');
};

exports.bookinstance_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance create POST');
};

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