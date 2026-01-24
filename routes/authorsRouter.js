import {Router} from "express";
import {
    getAllAuthors,
    getAddAuthor,
    addAuthor,
    getUpdateAuthor,
    updateAuthor,
    deleteAuthor,
    confirmUpdateAuthor
} from "../controllers/authorsControllers.js";

const authorsRouter = Router();

authorsRouter.get("/", getAllAuthors);
authorsRouter.get("/add", getAddAuthor);
authorsRouter.post("/add", addAuthor);
authorsRouter.get("/update/:authorId", getUpdateAuthor);
authorsRouter.post("/update/:authorId/confirm", confirmUpdateAuthor);
authorsRouter.post("/update/:authorId", updateAuthor);
authorsRouter.post("/delete/:authorId", deleteAuthor);


export default authorsRouter;