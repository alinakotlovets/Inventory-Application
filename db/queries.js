import {pool} from "./pool.js";

export async function getAllBooksFromBd() {
    const query = `
        SELECT books.book_id,
               books.book_name,
               books.book_description,
               books.book_img,
               books.publication_date,
               books.price,
               authors.author_first_name,
               authors.author_last_name,
               ARRAY_AGG(genres.genre_name) AS genres
        FROM books
                 JOIN authors ON books.author_id = authors.author_id
                 LEFT JOIN book_genres ON books.book_id = book_genres.book_id
                 LEFT JOIN genres ON book_genres.genre_id = genres.genre_id
        GROUP BY books.book_id, authors.author_id
    `;

    const {rows} = await pool.query(query);
    return rows;
}

export async function getAllGenresFromBd() {
    const {rows} = await pool.query("SELECT * FROM genres")
    return rows;
}

export async function getAllAuthorsFromBd() {
    const {rows} = await pool.query("SELECT * FROM authors")
    return rows;
}

export async function addAuthorsToBd(firstName, lastName) {
    await pool.query("INSERT INTO authors (author_first_name, author_last_name)  VALUES ($1, $2)", [firstName, lastName])
}

export async function addGenreToDb(genre) {
    await pool.query("INSERT INTO genres (genre_name) VALUES ($1)", [genre]);
}


export async function addBookToBd(book_name, book_description, bookImg, publicationDate, price, author_id, genres) {
    const result = await pool.query("INSERT INTO books (book_name, book_description, book_img, publication_date, price, author_id)  VALUES ($1, $2, $3, $4, $5, $6) RETURNING book_id", [book_name, book_description, bookImg, publicationDate, price, author_id]);
    const bookId = result.rows[0].book_id;
    let selectedGenres = genres;
    if (!Array.isArray(genres)) {
        selectedGenres = [genres];
    }
    selectedGenres = selectedGenres.map(id => parseInt(id, 10));

    for (let genreId of selectedGenres) {
        await pool.query("INSERT INTO book_genres (book_id, genre_id)  VALUES ($1, $2)", [bookId, genreId])
    }
}


export async function updateAuthorsInDb(authorId, authorFirstName, authorLastName) {
    await pool.query("UPDATE authors SET  author_first_name = $1, author_last_name = $2 WHERE author_id = $3", [authorFirstName, authorLastName, authorId])
}

export async function getAuthorById(authorId) {
    const {rows} = await pool.query("SELECT * FROM authors WHERE  author_id = $1", [authorId]);
    return rows;
}

export async function getGenreById(genreId) {
    const {rows} = await pool.query("SELECT * FROM genres WHERE  genre_id = $1", [genreId]);
    return rows;
}

export async function updateGenreInDb(genreId, genreName) {
    await pool.query("UPDATE genres SET  genre_name = $1 WHERE genre_id = $2", [genreName, genreId])
}

export async function getBookDataById(bookId) {
    const query = `
        SELECT books.book_id,
               books.book_name,
               books.book_description,
               books.book_img,
               books.publication_date,
               books.price,
               authors.author_id,
               authors.author_first_name,
               authors.author_last_name,
               ARRAY_AGG(genres.genre_id) AS genres
        FROM books
                 JOIN authors ON books.author_id = authors.author_id
                 LEFT JOIN book_genres ON books.book_id = book_genres.book_id
                 LEFT JOIN genres ON book_genres.genre_id = genres.genre_id
        WHERE books.book_id = $1
        GROUP BY books.book_id, authors.author_id
    `;

    const {rows} = await pool.query(query, [bookId]);
    return rows;
}

export async function updateBookInDb(bookId, bookName, description, bookImg, publicationDate, price, authorId) {
    const query = `
        UPDATE books
        SET book_name        = $1,
            book_description = $2,
            book_img         = $3,
            publication_date = $4,
            price            = $5,
            author_id        = $6
        WHERE book_id = $7
    `;

    await pool.query(query, [bookName, description, bookImg, publicationDate, price, authorId, bookId])
}


export async function updateBookGenreInDb(bookId, genres) {
    const {rows} = await pool.query("SELECT * FROM book_genres WHERE  book_id = $1", [bookId])
    let prevGenres = [];
    let removedGenres = [];
    let addedGenres = [];

    genres = genres.map(id => parseInt(id, 10));

    for (let row of rows) {
        prevGenres.push(row.genre_id);
    }

    for (let genre of genres) {
        if (!prevGenres.includes(genre)) {
            addedGenres.push(genre);
        }
    }
    for (let genre of prevGenres) {
        if (!genres.includes(genre)) {
            removedGenres.push(genre);
        }
    }

    for (let genre of removedGenres) {
        await pool.query("DELETE FROM book_genres WHERE genre_id = $1 AND book_id = $2", [genre, bookId])
    }

    for (let genre of addedGenres) {
        await pool.query("INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2)", [bookId, genre])
    }
}


export async function deleteBookFromDb(bookId) {
    await pool.query("DELETE FROM books WHERE book_id = $1", [bookId]);
}

export async function deleteAuthorFromBb(authorId) {
    await pool.query("DELETE FROM books WHERE author_id = $1", [authorId]);
    await pool.query("DELETE FROM authors WHERE author_id = $1", [authorId]);
}

export async function deleteGenreFromDb(genreId) {
    const query = `
        DELETE
        FROM books
        WHERE book_id IN (SELECT books.book_id
                          FROM books
                                   LEFT JOIN book_genres ON books.book_id = book_genres.book_id
                          GROUP BY books.book_id
                          HAVING COUNT(book_genres.genre_id) = 1
                             AND MAX(book_genres.genre_id) = $1);
    `;

    await pool.query(query, [genreId]);
    await pool.query("DELETE FROM book_genres WHERE genre_id = $1", [genreId]);
    await pool.query("DELETE FROM genres WHERE genre_id = $1", [genreId]);
}


export async function searchInDb(data) {
    const searchPattern = `%${data}%`;
    const query = `
        SELECT *
        FROM books
                 LEFT JOIN authors ON books.author_id = authors.author_id
        WHERE books.book_name ILIKE $1
           OR authors.author_first_name ILIKE $1
           OR authors.author_last_name ILIKE $1
    `;


    const {rows} = await pool.query(query, [searchPattern]);
    return rows;
}