import {getAllGenresFromBd, addGenreToDb, getGenreById, updateGenreInDb, deleteGenreFromDb} from "../db/queries.js"
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


export async function getUpdateGenre(req, res){
    const {genreId} = req.params;
    const genre = await getGenreById(Number(genreId));
    if (!genre){
        throw new Error("author not found");
    }
    res.render("updateGenre", {genreId: genreId, genreName: genre[0].genre_name});
}

export async function updateGenre(req, res){
    const {genreId} = req.params;
    const {genreName} = req.body;
    await updateGenreInDb(genreId, genreName);
    res.redirect("/genres");
}


export async function deleteGenre(req, res){
    const {genreId} = req.params;
    await deleteGenreFromDb(genreId);
    res.redirect("/genres");
}