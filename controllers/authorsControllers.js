import {
    getAllAuthorsFromBd,
    addAuthorsToBd,
    updateAuthorsInDb,
    getAuthorById,
    deleteAuthorFromBb
} from "../db/queries.js";
import 'dotenv/config';

export async function getAllAuthors(req, res) {
    const authors = await getAllAuthorsFromBd();
    if (!authors) {
        throw new Error("not found");
    }
    res.render("authors", {authors});
}

export function getAddAuthor(req, res) {
    res.render("addAuthor");
}

export async function addAuthor(req, res) {
    const {firstName, lastName} = req.body;
    await addAuthorsToBd(firstName, lastName);
    res.redirect("/authors");
}


export async function getUpdateAuthor(req, res) {
    const {authorId} = req.params;
    const author = await getAuthorById(Number(authorId));
    if (!author) {
        throw new Error("author not found");
    }
    res.render("updateAuthor", {
        authorId: authorId,
        authorLastName: author[0].author_last_name,
        authorFirstName: author[0].author_first_name
    });
}


export async function confirmUpdateAuthor(req, res) {
    const {authorId} = req.params;
    const {confirmPassword} = req.body;

    if (confirmPassword.trim() !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({message: "Password incorrect"});
    }

    return res.status(200).json({
        redirectTo: `/authors/update/${authorId}`
    });
}

export async function updateAuthor(req, res) {
    const {authorId} = req.params;
    const {confirmPassword, firstName, lastName} = req.body;
    if (confirmPassword.trim() !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({message: "Password incorrect"});
    }
    await updateAuthorsInDb(authorId, firstName, lastName);
    return res.status(200).json({redirectTo: "/authors"});
}


export async function deleteAuthor(req, res) {
    const {authorId} = req.params;
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
    await deleteAuthorFromBb(authorId);

    return res.status(200).json({
        message: "Author deleted",
        redirectTo: "/genres"
    });
}