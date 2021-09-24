const express = require("express");
var bodyParser = require("body-parser");

//Database
const database = require("./database");


//Initializing project
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

/*
Route               /
Description         Get all the books
Access              PUBLIC
Parameter           NONE
Methods             GET
 */
booky.get("/", (req,res) => {
    return res.json({books : database.books});
});


/*
Route               /is
Description         Get specific book on ISBN
Access              PUBLIC
Parameter           isbn
Methods             GET
 */
booky.get("/is/:isbn", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN ===req.params.isbn
    );

    if(getSpecificBook.length === 0 ){
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
booky.get("/c/:category", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );

    if(getSpecificBook.length === 0 ){
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
booky.get("/lan/:language", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.language
    );

    if(getSpecificBook.length === 0 ){
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
booky.get("/author", (req,res) => {

    return res.json({authors : database.author});
    
});


/*
Route               /author
Description         Get specific author on id
Access              PUBLIC
Parameter           id
Methods             GET
 */
booky.get("/author/:id", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === parseInt(req.params.id)
    );

    if(getSpecificAuthor.length === 0 ){
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
booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0 ){
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
booky.get("/pub", (req,res) => {

    return res.json({publications : database.publication});
    
});



/*
Route               /pub
Description         Get specific publication on id
Access              PUBLIC
Parameter           id
Methods             GET
 */
booky.get("/pub/:id", (req,res) => {
    const getSpecificPublicaton = database.publication.filter(
        (publication) => publication.id === parseInt(req.params.id)
    );

    if(getSpecificPublicaton.length === 0 ){
        return res.json({error : `No Publication found for id of ${req.params.id}`});
    }

    return res.json({Publication : getSpecificPublicaton});
});



/*
Route               /pub/book
Description         Get specific author on book's isbn
Access              PUBLIC
Parameter           ISBN
Methods             GET
 */
booky.get("/pub/book/:isbn", (req,res) => {
    const getSpecificPublicaton = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );

    if(getSpecificPublicaton.length === 0 ){
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


booky.post("/book/new" , (req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks : database.books});
});



/*
Route               /author/new
Description         Add new author
Access              PUBLIC
Parameter           NONE
Methods             POST
 */


booky.post("/author/new" , (req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({updatedAuthors : database.author});
});



/*
Route               /pub/new
Description         Add new publication
Access              PUBLIC
Parameter           NONE
Methods             POST
 */


booky.post("/pub/new" , (req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json({updatedPubications : database.publication});
});



//PUT


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


booky.delete ("/book/delete/:isbn" , (req,res) => {
//Whichever book doesnot matches with the isbn, just send to a new updated array
//rest will be filtered out

const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
)

database.books = updatedBookDatabase;
return res.json(
    {
        updatedbooks : database.books
    }
);

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