require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");


//Initializing project
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

//Connection to database

mongoose.connect(process.env.MONGO_URL
).then(() => console.log("Connection Established"));


/*
Route               /
Description         Get all the books
Access              PUBLIC
Parameter           NONE
Methods             GET
 */
booky.get("/", async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json({books : getAllBooks});
});


/*
Route               /is
Description         Get specific book on ISBN
Access              PUBLIC
Parameter           isbn
Methods             GET
 */
booky.get("/is/:isbn", async(req,res) => {


    const getSpecificBook = await BookModel.findOne({ISBN : req.params.isbn});
    

    if(!getSpecificBook){
        return res.json({error : `No book found for ISBN of ${req.params.isbn}`});
    }

    return res.json({books : getSpecificBook});
});


/*
Route               /c
Description         Get specific books on category
Access              PUBLIC
Parameter           CATEGORY
Methods             GET
 */
booky.get("/c/:category", async (req,res) => {
    const getSpecificBook = await BookModel.find({category : req.params.category});
    

    if(!getSpecificBook){
        return res.json({error : `No book found for category of ${req.params.category}`});
    }

    return res.json({books : getSpecificBook});
});


/*
Route               /lan
Description         Get specific books on lan
Access              PUBLIC
Parameter           LANGUAGE
Methods             GET
 */
booky.get("/lan/:language", async (req,res) => {
    const getSpecificBook = await BookModel.find({language : req.params.language});
    

    if(!getSpecificBook){
        return res.json({error : `No book found for language of ${req.params.language}`});
    }

    return res.json({books : getSpecificBook});
});

/*
Route               /author
Description         Get all authors
Access              PUBLIC
Parameter           NONE
Methods             GET
 */
booky.get("/author", async (req,res) => {

    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
    
});


/*
Route               /author
Description         Get specific author on id
Access              PUBLIC
Parameter           id
Methods             GET
 */
booky.get("/author/:id", async(req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne({id : req.params.id});

    if(!getSpecificAuthor){
        return res.json({error : `No author found for id of ${req.params.id}`});
    }

    return res.json({author : getSpecificAuthor});
});



/*
Route               /author/book
Description         Get specific author on book's isbn
Access              PUBLIC
Parameter           ISBN
Methods             GET
 */
booky.get("/author/book/:isbn", async (req,res) => {
    const getSpecificAuthor = await AuthorModel.find({books : req.params.isbn});

    if(!getSpecificAuthor ){
        return res.json({error : `No author found for book of ${req.params.isbn}`});
    }

    return res.json({author : getSpecificAuthor});
});






/*
Route               /pub
Description         Get all publications
Access              PUBLIC
Parameter           NONE
Methods             GET
 */
booky.get("/pub", async (req,res) => {

    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
    
});



/*
Route               /pub
Description         Get specific publication on id
Access              PUBLIC
Parameter           id
Methods             GET
 */
booky.get("/pub/:id", async (req,res) => {
    const getSpecificPublicaton = await PublicationModel.findOne({id : req.params.id});
    if(!getSpecificPublicaton){
        return res.json({error : `No Publication found for id of ${req.params.id}`});
    }

    return res.json({Publication : getSpecificPublicaton});
});



/*
Route               /pub/book
Description         Get specific publication on book's isbn
Access              PUBLIC
Parameter           ISBN
Methods             GET
 */
booky.get("/pub/book/:isbn", async (req,res) => {
    const getSpecificPublicaton = await PublicationModel.find({books : req.params.isbn});

    if(!getSpecificPublicaton){
        return res.json({error : `No publication found for book of ${req.params.isbn}`});
    }

    return res.json({Publication : getSpecificPublicaton});
});



//POST


/*
Route               /book/new
Description         Add new books
Access              PUBLIC
Parameter           NONE
Methods             POST
 */


booky.post("/book/new",async (req,res) => {
    const { newBook } = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({
      books: addNewBook,
      message: "Book was added !!!"
    });
  });



/*
Route               /author/new
Description         Add new author
Access              PUBLIC
Parameter           NONE
Methods             POST
 */


booky.post("/author/new",async (req,res) => {
    const { newAuthor } = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
      return res.json(
        {
          author: addNewAuthor,
          message: "Author was added!!!"
        }
      );
    });



/*
Route               /pub/new
Description         Add new publication
Access              PUBLIC
Parameter           NONE
Methods             POST
 */


booky.post("/pub/new",async (req,res) => {
    const { newPublication } = req.body;
    const addNewPublication = AuthorModel.create(newPublication);
      return res.json(
        {
          author: addNewPublication,
          message: "Author was added!!!"
        }
      );
    });


//PUT

/*
Route               /book/update
Description         Update book on isbn
Access              PUBLIC
Parameter           ISBN
Methods             PUT
 */

booky.put("/book/update/:isbn",async (req,res) =>{
const updatedBook = await BookModel.findOneAndUpdate(
    {
        ISBN : req.params.isbn
    },
    {
        title : req.body.bookTitle
    },
    {
        new : true
    }
);
return res.json({
    books : updatedBook
});

});



/*
Route               /pub/book/author/update
Description         Update or add a new author
Access              PUBLIC
Parameter           ISBN
Methods             PUT
 */

booky.put("/book/author/update/:isbn",async (req,res) =>{
    //Update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn
        },
        {
            $addToSet:{
            author : req.body.newAuthor
            }
        },
        {
            new : true
        }
    );
        //Uodate the author database

        const updatedAuthor = await AuthorModel.findOneAndUpdate(
            {
                id : req.body.newAuthor
            },
            {
                $addToSet:{
                books : req.params.isbn
                }
            },
            {
                new : true
            }
        );    




    return res.json({
        books : updatedBook,
        authors : updatedAuthor
    });
    
    });
    





/*
Route               /pub/update/book
Description         Update or add a new publication
Access              PUBLIC
Parameter           ISBN
Methods             PUT
 */

booky.put("/pub/update/book/:isbn" , (req,res) => {
    //Update the publication database 
    database.publication.forEach((pub) =>{
        if(pub.id === req.body.pubId){
           return pub.books.push(req.params.isbn);
        };
    });
    //Update the book database 
    database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn){
            book.publications = req.body.pubId;
            return;
        };

    });

    return res.json(
    {
        books : database.books,
        publications : database.publication,
        message : "Successfully updated publications"
    }
    );

});



//DELETE


/*
Route               /book/delete
Description         Delete a book
Access              PUBLIC
Parameter           ISBN
Methods             DELETE
 */


booky.delete ("/book/delete/:isbn" ,async (req,res) => {
const updatedBook = await BookModel.findOneAndDelete(
    {
        ISBN : req.params.isbn
    }
);

return res.json({
    books : updatedBook
});

});


/*
Route               /book/delete/author/
Description         Delete a author from a book and related book from author
Access              PUBLIC
Parameter           ISBN,
Methods             DELETE
 */
booky.delete("/book/delete/author/:isbn/:authorId" , (req , res) => {
    //update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            const newAuthor = book.author.filter(
            (auth) => auth !== parseInt(req.params.authorId)
            );
            book.author = newAuthor;
            return;
        }

    });

    //update author database
    database.author.forEach((auth) =>{
        if(auth.id === parseInt(req.params.authorId)){
            const newBookList = auth.books.filter(
                (book)=> book !== parseInt(req.params.isbn)
                );
            auth.books = newBookList;
            return;
        }
    });
    return res.json({
        book : database.books,
        author : database.author,
        message : "Author was deleted!!!!"
    });
});

/*
Route               /book/author/delete
Description         Delete a author from a book
Access              PUBLIC
Parameter           ISBN
Methods             DELETE
 */
booky.delete("/book/author/delete/:isbn/:authorId" , (req , res) => {
    //update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            const newAuthor = book.author.filter(
            (auth) => auth !== parseInt(req.params.authorId)
            );
            book.author = newAuthor;
            return;
        }

    });


    return res.json({
        book : database.books,
        message : "Author was deleted!!!!"
    });
});







booky.listen(3000,()=>{
    console.log("The server is up and running!");
});