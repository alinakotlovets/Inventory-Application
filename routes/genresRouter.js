import {Router} from "express";
import {getAllGenres, getAddGenre, addGenre} from "../controllers/genresController.js";

const genresRouter = Router();

genresRouter.get("/", getAllGenres);
genresRouter.get("/add", getAddGenre);
genresRouter.post("/add", addGenre);

export default genresRouter;