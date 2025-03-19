/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const schema = mongoose.Schema;
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      Book.find({}, (err, data) => {
        if(err) return res.json({ error: 'could not get books' });
        let books = data.map(book => {
          return {
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          };
        });
        return res.json(books);
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      
      if(!title)
        return res.json('missing required field title');
      
      let book = new Book({ title: title });
      book.save((err, data) => {
        if(err) return res.json({ error: 'could not save book' });
        return res.json({ _id: data._id, title: data.title });
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      Book.deleteMany({}, (err, data) => {
        if(err || !data) return res.json({ error: 'could not delete books' });
        return res.json('complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book.findById(bookid, (err, data) => {
        if(err) return res.json('no book exists');
        if(!data) return res.json('no book exists');
        return res.json(data);
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if(!comment)
        return res.json('missing required field comment');

      Book.findById(bookid, (err, book) => {
        if(err || !book) return res.json('no book exists');

        book.comments.push(comment);
        book.save((err, data) => {
          if(err) return res.json({ error: 'could not save comment' });
          return res.json(data);
        });
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      Book.findByIdAndDelete(bookid, (err, data) => {
        if(err || !data) return res.json('no book exists');
        return res.json('delete successful');
      });
    });
  
};
