import {Router} from "express";
import {
    getAllGenres,
    getAddGenre,
    addGenre,
    getUpdateGenre,
    updateGenre,
    deleteGenre,
    validateGenre,
    postValidateGenre
} from "../controllers/genresController.js";

const genresRouter = Router();

genresRouter.get("/", getAllGenres);
genresRouter.get("/add", getAddGenre);
genresRouter.post("/add", validateGenre, addGenre);
genresRouter.get("/update/:genreId", getUpdateGenre);
genresRouter.post("/update/:genreId/validate", validateGenre, postValidateGenre)
genresRouter.post("/update/:genreId", updateGenre);
genresRouter.post("/delete/:genreId", deleteGenre);

export default genresRouter;