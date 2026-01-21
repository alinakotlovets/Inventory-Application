import {
    getAllBooksFromBd,
    getAllGenresFromBd,
    getAllAuthorsFromBd,
    addBookToBd
} from "../db/queries.js";

export async function getAllBooks(req, res) {
    const books = await getAllBooksFromBd();
    if (!books) {
        throw new Error("not found");
    }
    res.render("index", {books})
}

export async function getAddBook(req, res) {
    const authors = await getAllAuthorsFromBd();
    const genres = await getAllGenresFromBd();
    if (!authors) {
        throw new Error("not found authors");
    }
    if (!genres) {
        throw new Error("not found genres");
    }
    res.render("addBook", {authors: authors, genres: genres})
}

export async function addBook(req, res) {
    const {bookName, description, bookImg = null, publicationDate = null, price = null, author, genres} = req.body;
    await addBookToBd(bookName, description, bookImg, publicationDate, price, author, genres);
    res.redirect("/authors");
}

