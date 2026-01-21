import {pool} from "./pool.js";

export async function getAllBooksFromBd(){
    const query = `
        SELECT 
            books.book_id,
            books.book_name,
            books.book_description,
            authors.author_first_name,
            authors.author_last_name,
            ARRAY_AGG(genres.genre_name) AS genres
        FROM books
        JOIN authors ON books.author_id = authors.author_id
        LEFT JOIN book_genres ON books.book_id = book_genres.book_id
        LEFT JOIN genres ON book_genres.genre_id = genres.genre_id
        GROUP BY books.book_id, authors.author_id
    `;

    const { rows } = await pool.query(query);
    return rows;
}

export async function getAllGenresFromBd(){
    const {rows} = await pool.query("SELECT * FROM genres")
    return rows;
}

export async function getAllAuthorsFromBd(){
    const {rows} = await pool.query("SELECT * FROM authors")
    return rows;
}

export async function addAuthorsToBd(firstName, lastName){
    await pool.query("INSERT INTO authors (author_first_name, author_last_name)  VALUES ($1, $2)", [firstName, lastName])
}

export async function addGenreToDb(genre){
    await pool.query("INSERT INTO genres (genre_name) VALUES ($1)", [genre]);
}


export async function addBookToBd(book_name, book_description, bookImg, publicationDate, price, author_id, genres){
    const result = await pool.query("INSERT INTO books (book_name, book_description, book_img, publication_date, price, author_id)  VALUES ($1, $2, $3, $4, $5, $6) RETURNING book_id", [book_name, book_description, bookImg, publicationDate, price, author_id]);
    const bookId = result.rows[0].book_id;
    let selectedGenres = genres;
    if (!Array.isArray(genres)) {
        selectedGenres = [genres];
    }
    selectedGenres = selectedGenres.map(id => parseInt(id, 10));

    for(let  genreId of selectedGenres){
        await pool.query("INSERT INTO book_genres (book_id, genre_id)  VALUES ($1, $2)", [bookId, genreId] )
    }
}