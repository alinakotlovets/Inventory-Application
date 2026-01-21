import {Router} from "express";
import {getAllAuthors, getAddAuthor, addAuthor} from "../controllers/authorsControllers.js";

const authorsRouter = Router();

authorsRouter.get("/", getAllAuthors);
authorsRouter.get("/add", getAddAuthor);
authorsRouter.post("/add", addAuthor)

export default authorsRouter;