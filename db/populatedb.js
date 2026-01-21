import { Client }  from "pg";
import 'dotenv/config';

const SQL = `
    CREATE TABLE IF NOT EXISTS authors (
        author_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        author_first_name VARCHAR(255) NOT NULL,
        author_last_name VARCHAR(255) NOT NULL
        );

    CREATE TABLE IF NOT EXISTS genres (
        genre_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        genre_name VARCHAR(255) NOT NULL UNIQUE
        );

    CREATE TABLE IF NOT EXISTS books (
        book_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        book_name TEXT NOT NULL,
        book_description TEXT,
        book_img TEXT,
        publication_date DATE,
        price NUMERIC,
        author_id INTEGER NOT NULL,
        CONSTRAINT fk_author
        FOREIGN KEY(author_id)
        REFERENCES authors(author_id)
        ON DELETE CASCADE
        );

    CREATE TABLE IF NOT EXISTS book_genres (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        book_id INTEGER NOT NULL,
        genre_id INTEGER NOT NULL,
        CONSTRAINT fk_book
        FOREIGN KEY(book_id)
        REFERENCES books(book_id)
        ON DELETE CASCADE,
        CONSTRAINT fk_genre
        FOREIGN KEY(genre_id)
        REFERENCES genres(genre_id)
        ON DELETE CASCADE,
        UNIQUE (book_id, genre_id)
        );

    INSERT INTO authors (author_first_name, author_last_name)
    VALUES
        ('George', 'Orwell'),
        ('J.K.', 'Rowling');

    INSERT INTO genres (genre_name)
    VALUES
        ('Dystopian'),
        ('Fantasy');

    INSERT INTO books (book_name, book_description, author_id)
    VALUES
        ('1984', 'Dystopian novel', 1),
        ('Harry Potter', 'Fantasy novel', 2);

    INSERT INTO book_genres (book_id, genre_id)
    VALUES
        (1, 1),
        (2, 2);
`;

const dbUrl = process.env.NODE_ENV === 'production'
    ? process.env.PROD_DATABASE_URL
    : process.env.DEV_DATABASE_URL;

async function main() {
    console.log("seeding...");
    const client = new Client({
        connectionString: dbUrl,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();
