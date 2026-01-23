import {Router} from "express";
import {getAllAuthors, getAddAuthor, addAuthor, getUpdateAuthor, updateAuthor, deleteAuthor} from "../controllers/authorsControllers.js";

const authorsRouter = Router();

authorsRouter.get("/", getAllAuthors);
authorsRouter.get("/add", getAddAuthor);
authorsRouter.post("/add", addAuthor);
authorsRouter.get("/update/:authorId", getUpdateAuthor);
authorsRouter.post("/update/:authorId", updateAuthor);
authorsRouter.get("/delete/:authorId",  deleteAuthor);

export default authorsRouter;