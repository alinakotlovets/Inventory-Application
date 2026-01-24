import {
    getAllGenresFromBd,
    addGenreToDb,
    getGenreById,
    updateGenreInDb,
    deleteGenreFromDb,
} from "../db/queries.js"
import {body, validationResult, matchedData} from "express-validator";


export const validateGenre = [
    body("genreName")
        .trim()
        .isAlpha().withMessage(`genre name must only contains letter of en alphabet`)
        .isLength({min: 2, max: 40}).withMessage(`genre name must have at least 1 latter and no more than 40 letter`),
];

export async function getAllGenres(req, res) {
    const genres = await getAllGenresFromBd();
    if (!genres) {
        throw new Error("not found");
    }
    res.render("genres", {genres})
}

export function getAddGenre(req, res) {
    res.render("addGenre", {errors: [], oldInput: ""});
}

export async function addGenre(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("addGenre", {
            errors: errors.array(),
            oldInput: req.body.genreName
        });
    }
    const {genreName} = matchedData(req);
    await addGenreToDb(genreName);
    res.redirect("/genres");
}


export async function getUpdateGenre(req, res) {
    const {genreId} = req.params;
    const genre = await getGenreById(Number(genreId));
    if (!genre) {
        throw new Error("author not found");
    }
    res.render("updateGenre", {genreId: genreId, genreName: genre[0].genre_name, errors: []});
}

export async function updateGenre(req, res) {
    const {genreId} = req.params;
    const {genreName, confirmPassword} = req.body;

    if (!confirmPassword || confirmPassword.trim() !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({message: "Password incorrect"});
    }

    await updateGenreInDb(genreId, genreName);

    return res.status(200).json({redirectTo: "/genres"});
}

export async function postValidateGenre(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    return res.status(200).json({
        errors: [],
    })
}

export async function deleteGenre(req, res) {
    const {genreId} = req.params;
    const {confirmPassword} = req.body;
    if (!confirmPassword) {
        return res.status(400).json({
            message: "Password is required"
        })
    }
    if (confirmPassword.trim() !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({
            message: "Password is incorrect"
        })
    }
    await deleteGenreFromDb(genreId);
    return res.status(200).json({
        message: "Genre deleted",
        redirectTo: "/genres"
    })
}
