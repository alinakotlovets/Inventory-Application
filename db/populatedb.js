import {Client} from "pg";
import 'dotenv/config';

const dbUrl = process.env.NODE_ENV === 'production'
    ? process.env.PROD_DATABASE_URL
    : process.env.DEV_DATABASE_URL;

async function main() {
    const client = new Client({
        connectionString: dbUrl,
        ssl: {rejectUnauthorized: false}
    });

    try {
        await client.connect();
        console.log("Seeding...");

        await client.query(`
            CREATE TABLE IF NOT EXISTS authors
            (
                author_id
                INTEGER
                PRIMARY
                KEY
                GENERATED
                ALWAYS AS
                IDENTITY,
                author_first_name
                VARCHAR
            (
                255
            ) NOT NULL,
                author_last_name VARCHAR
            (
                255
            ) NOT NULL
                );

            CREATE TABLE IF NOT EXISTS genres
            (
                genre_id
                INTEGER
                PRIMARY
                KEY
                GENERATED
                ALWAYS AS
                IDENTITY,
                genre_name
                VARCHAR
            (
                255
            ) NOT NULL UNIQUE
                );

            CREATE TABLE IF NOT EXISTS books
            (
                book_id
                INTEGER
                PRIMARY
                KEY
                GENERATED
                ALWAYS AS
                IDENTITY,
                book_name
                TEXT
                NOT
                NULL,
                book_description
                TEXT,
                book_img
                TEXT,
                publication_date
                DATE,
                price
                NUMERIC,
                author_id
                INTEGER
                NOT
                NULL,
                CONSTRAINT
                fk_author
                FOREIGN
                KEY
            (
                author_id
            )
                REFERENCES authors
            (
                author_id
            )
                ON DELETE CASCADE
                );

            CREATE TABLE IF NOT EXISTS book_genres
            (
                id
                INTEGER
                PRIMARY
                KEY
                GENERATED
                ALWAYS AS
                IDENTITY,
                book_id
                INTEGER
                NOT
                NULL,
                genre_id
                INTEGER
                NOT
                NULL,
                CONSTRAINT
                fk_book
                FOREIGN
                KEY
            (
                book_id
            )
                REFERENCES books
            (
                book_id
            )
                ON DELETE CASCADE,
                CONSTRAINT fk_genre FOREIGN KEY
            (
                genre_id
            )
                REFERENCES genres
            (
                genre_id
            )
                ON DELETE CASCADE,
                UNIQUE
            (
                book_id,
                genre_id
            )
                );
        `);

        await client.query(`
      TRUNCATE book_genres, books, genres, authors RESTART IDENTITY CASCADE;
    `);

        const authorsRes = await client.query(`
            INSERT INTO authors (author_first_name, author_last_name)
            VALUES ('George', 'Orwell'),
                   ('J.K.', 'Rowling') RETURNING author_id;
        `);
        const [georgeId, rowlingId] = authorsRes.rows.map(row => row.author_id);

        const genresRes = await client.query(`
            INSERT INTO genres (genre_name)
            VALUES ('Dystopian'),
                   ('Fantasy') ON CONFLICT (genre_name) DO NOTHING
      RETURNING genre_id, genre_name;
        `);

        const genreMap = {};
        for (const row of genresRes.rows) {
            genreMap[row.genre_name] = row.genre_id;
        }
        const allGenresRes = await client.query(`SELECT genre_id, genre_name
                                                 FROM genres;`);
        allGenresRes.rows.forEach(row => genreMap[row.genre_name] = row.genre_id);

        const booksRes = await client.query(`
            INSERT INTO books (book_name, book_description, author_id)
            VALUES ('1984', 'Dystopian novel', $1),
                   ('Harry Potter', 'Fantasy novel', $2) RETURNING book_id, book_name;
        `, [georgeId, rowlingId]);

        const bookMap = {};
        booksRes.rows.forEach(row => bookMap[row.book_name] = row.book_id);

        await client.query(`
            INSERT INTO book_genres (book_id, genre_id)
            VALUES ($1, $2),
                   ($3, $4);
        `, [bookMap['1984'], genreMap['Dystopian'], bookMap['Harry Potter'], genreMap['Fantasy']]);

        console.log("Done!");
    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        await client.end();
    }
}

main();