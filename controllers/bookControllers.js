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
import {body, validationResult, matchedData} from "express-validator";

export const bookValidation = [
    body("bookName")
        .trim()
        .notEmpty().withMessage("Book name is required")
        .isLength({min: 1}).withMessage("Book name must have at least 1 letter"),

    body("description")
        .optional({checkFalsy: true})
        .isLength({max: 60}).withMessage("Description can have max 60 characters"),

    body("publicationDate")
        .optional({checkFalsy: true})
        .isISO8601().withMessage("Publication date must be a valid date"),

    body("price")
        .optional({checkFalsy: true})
        .isFloat({min: 1}).withMessage("Price must be a positive number and more then 0"),

    body("author")
        .notEmpty().withMessage("Author is required")
        .bail(),

    body("genres")
        .custom(value => {
            if (!value) return false;
            const arr = Array.isArray(value) ? value : [value];
            return arr.every(v => !isNaN(Number(v)));
        }).withMessage("Select at least one genre")
];

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
    res.render("addBook", {
        authors: authors,
        genres: genres,
        errors: [],
        bookName: "",
        description: "",
        publicationDate: "",
        price: "",
        author: "",
        genresSelected: ""
    })
}

export async function addBook(req, res) {
    const errors = validationResult(req);
    const authors = await getAllAuthorsFromBd();
    const genresBd = await getAllGenresFromBd();
    if (!errors.isEmpty()) {
        return res.status(400).render("addBook", {
            authors,
            genres: genresBd,
            errors: errors.array(),
            bookName: req.body.bookName,
            description: req.body.description,
            publicationDate: req.body.publicationDate,
            price: req.body.price,
            author: req.body.author,
            genresSelected: req.body.genres
        });
    }
    let {bookName, description, publicationDate, price, author, genres} = matchedData(req);
    description = description === "" ? null : description;
    publicationDate = publicationDate === "" ? null : publicationDate;
    price = price == null || price === "" ? null : Number(price);
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

export async function postBookValidation(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    return res.status(200).json({
        errors: []
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