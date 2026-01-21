import {getAllAuthorsFromBd, addAuthorsToBd} from "../db/queries.js";

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
