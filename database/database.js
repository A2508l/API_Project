const books = [
    {
        ISBN : "12345BOOK",
        title : "Tesla",
        pubDate : "2021-09-05",
        language : "en",
        numPage : 250,
        author : [1,2],
        publications : [1],
        category : ["tech","space","education"]
    }
];


const author = [
    {
        id : 1,
        name : "Anshul",
        books : ["12345BOOK","SecretBook"]
    },
    {
        id : 2,
        name : "Elon Musk",
        books : ["12345BOOK"]
    }

];


const publication = [
    {
        id : 1,
        name : "Writex",
        books : ["12345BOOK"]
    }
];


module.exports = {books, author, publication};