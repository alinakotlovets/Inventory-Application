import {Router} from "express";
import {
    getAllBooks,
    getAddBook,
    addBook,
    getUpdateBook,
    updateBook,
    deleteBook,
    confirmUpdateBook
} from "../controllers/bookControllers.js"
import {upload} from "../middleware/multer.js";

const booksRouter = Router();

booksRouter.get("/", getAllBooks);
booksRouter.get("/add", getAddBook);
booksRouter.post("/add", upload.single('bookImg'), addBook);
booksRouter.get("/update/:bookId", getUpdateBook);
booksRouter.post("/update/:bookId/confirm", confirmUpdateBook)
booksRouter.post("/update/:bookId", upload.single('bookImg'), updateBook);
booksRouter.post("/delete/:bookId", deleteBook);

export default booksRouter;