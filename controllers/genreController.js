var Genre = require('../models/genre');

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
  res.send('NOT IMPLEMENTED: genre detail: ' + req.params.id);
};

exports.genre_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: genre create GET');
};

exports.genre_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: genre create POST');
};

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