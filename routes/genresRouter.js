import {Router} from "express";
import {getAllGenres, getAddGenre, addGenre, getUpdateGenre, updateGenre, deleteGenre} from "../controllers/genresController.js";

const genresRouter = Router();

genresRouter.get("/", getAllGenres);
genresRouter.get("/add", getAddGenre);
genresRouter.post("/add", addGenre);
genresRouter.get("/update/:genreId", getUpdateGenre);
genresRouter.post("/update/:genreId", updateGenre);
genresRouter.get("/delete/:genreId", deleteGenre);

export default genresRouter;