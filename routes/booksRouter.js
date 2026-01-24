import {Router} from "express";
import {
    getAllBooks,
    getAddBook,
    addBook,
    getUpdateBook,
    updateBook,
    deleteBook, bookValidation,
    postBookValidation
} from "../controllers/bookControllers.js"
import {upload} from "../middleware/multer.js";

const booksRouter = Router();

booksRouter.get("/", getAllBooks);
booksRouter.get("/add", getAddBook);
booksRouter.post("/add", upload.single('bookImg'), bookValidation, addBook);
booksRouter.post("/update/:bookId/validate", upload.single("bookImg"),
    bookValidation,
    postBookValidation);
booksRouter.post("/update/:bookId", upload.single("bookImg"), updateBook);
booksRouter.get("/update/:bookId", getUpdateBook);
booksRouter.post("/delete/:bookId", deleteBook);

export default booksRouter;