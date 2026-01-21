import {Router} from "express";
import {getAllBooks, getAddBook, addBook} from "../controllers/bookControllers.js"

const booksRouter = Router();

booksRouter.get("/", getAllBooks);
booksRouter.get("/add", getAddBook);
booksRouter.post("/add", addBook);

export default booksRouter;