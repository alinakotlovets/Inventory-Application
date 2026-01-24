import {Router} from "express";
import {
    getAllAuthors,
    getAddAuthor,
    addAuthor,
    getUpdateAuthor,
    updateAuthor,
    deleteAuthor,
    authorValidation,
    postAuthorValidation
} from "../controllers/authorsControllers.js";

const authorsRouter = Router();

authorsRouter.get("/", getAllAuthors);
authorsRouter.get("/add", getAddAuthor);
authorsRouter.post("/add", authorValidation, addAuthor);
authorsRouter.get("/update/:authorId", getUpdateAuthor);
authorsRouter.post("/update/:authorId/validate", authorValidation, postAuthorValidation)
authorsRouter.post("/update/:authorId", updateAuthor);
authorsRouter.post("/delete/:authorId", deleteAuthor);


export default authorsRouter;