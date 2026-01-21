import {getAllGenresFromBd, addGenreToDb} from "../db/queries.js"
export async function getAllGenres(req, res){
    const genres = await getAllGenresFromBd();
    if (!genres){
        throw new Error("not found");
    }
    res.render("genres", {genres})
}

export function getAddGenre(req, res){
    res.render("addGenre");
}

export async function addGenre(req, res){
    const genre = req.body.genre;
    await addGenreToDb(genre);
    res.redirect("/genres");
}
