import {getAllAuthorsFromBd, addAuthorsToBd, updateAuthorsInDb,  getAuthorById, deleteAuthorFromBb} from "../db/queries.js";

export async function getAllAuthors(req, res){
    const authors = await getAllAuthorsFromBd();
    if (!authors){
        throw new Error("not found");
    }
    res.render("authors", {authors});
}

export function getAddAuthor(req, res){
    res.render("addAuthor");
}

export async function addAuthor(req, res){
    const {firstName, lastName} = req.body;
    await addAuthorsToBd(firstName, lastName);
    res.redirect("/authors");
}


export async function getUpdateAuthor(req, res){
    const {authorId} = req.params;
    const author = await getAuthorById(Number(authorId));
    if (!author){
        throw new Error("author not found");
    }
    res.render("updateAuthor", {authorId: authorId, authorLastName: author[0].author_last_name, authorFirstName: author[0].author_first_name});
}

export async function updateAuthor(req, res){
    const {authorId} = req.params;
    const {firstName, lastName} = req.body;
    await updateAuthorsInDb(authorId,firstName, lastName);
    res.redirect("/authors");
}

export async function deleteAuthor(req, res){
    const {authorId} = req.params;
    await deleteAuthorFromBb(authorId);
    res.redirect("/authors");
}