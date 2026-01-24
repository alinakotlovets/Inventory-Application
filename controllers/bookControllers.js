import {
    getAllBooksFromBd,
    getAllGenresFromBd,
    getAllAuthorsFromBd,
    addBookToBd,
    getBookDataById,
    updateBookInDb,
    updateBookGenreInDb,
    deleteBookFromDb
} from "../db/queries.js";

export async function getAllBooks(req, res) {
    const data = await getAllBooksFromBd();
    if (!data) {
        throw new Error("not found");
    }
    let books = [];

    data.forEach((item) => {
        const dataWithFormattedDate = {
            ...item,
            formattedDate: new Intl.DateTimeFormat("uk-UA", {
                year: "numeric",
                month: "numeric",
                day: "numeric"
            }).format(new Date(item.publication_date))
        };

        books.push(dataWithFormattedDate);
    })
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
    let {bookName, description, publicationDate, price, author, genres} = req.body;
    description = description === "" ? null : description;
    publicationDate = publicationDate === "" ? null : publicationDate;
    price = price === "" ? null : Number(price);
    author = Number(author);
    const bookImg = req.file ? '/images/books/' + req.file.filename : null;
    await addBookToBd(bookName, description, bookImg, publicationDate, price, author, genres);

    res.redirect("/");
}


export async function getUpdateBook(req, res) {
    const {bookId} = req.params;
    const book = await getBookDataById(Number(bookId));
    const authors = await getAllAuthorsFromBd();
    const genres = await getAllGenresFromBd();
    if (!book) {
        throw new Error("author not found");
    }

    let formattedDate = null;
    if (book[0].publication_date) {
        const d = new Date(book[0].publication_date);
        formattedDate = d.toISOString().split('T')[0];
    }

    const bookGenreIds = (book[0].genres || []).map(id => Number(id));

    res.render("updateBook", {
        bookId: bookId,
        bookName: book[0].book_name,
        bookImg: book[0].book_img,
        bookDescription: book[0].book_description,
        bookAuthorId: book[0].author_id,
        bookPublication: formattedDate,
        bookPrice: book[0].price,
        authors: authors,
        bookGenreIds: bookGenreIds,
        genres: genres
    });

}

export async function updateBook(req, res) {
    const {bookId} = req.params;

    let {confirmPassword, bookName, description, publicationDate, price, author, genres} = req.body;
    if (confirmPassword.trim() !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({message: "Password incorrect"});
    }

    const book = await getBookDataById(bookId);
    let bookImg = req.file ? '/images/books/' + req.file.filename : (book[0] ? book[0].book_img : null);


    description = description === "" ? null : description;
    publicationDate = publicationDate === "" ? null : publicationDate;
    price = price === "" ? null : Number(price);
    author = Number(author);

    await updateBookInDb(bookId, bookName, description, bookImg, publicationDate, price, author);
    await updateBookGenreInDb(bookId, genres);
    return res.status(200).json({redirectTo: "/"});
}

export async function confirmUpdateBook(req, res) {
    const {bookId} = req.params;
    const {confirmPassword} = req.body;

    if (confirmPassword.trim() !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({message: "Password incorrect"});
    }

    return res.status(200).json({
        redirectTo: `/update/${bookId}`
    });
}

export async function deleteBook(req, res) {
    const {bookId} = req.params;
    const {confirmPassword} = req.body;

    if (!confirmPassword) {
        return res.status(400).json({
            message: "Password is required"
        });
    }

    if (confirmPassword.trim() !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({
            message: "Password incorrect!"
        });
    }

    await deleteBookFromDb(bookId);

    return res.status(200).json({
        message: "Author deleted",
        redirectTo: "/"
    });
}