import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import booksRouter from "./routes/booksRouter.js";
import genresRouter from "./routes/genresRouter.js";
import authorsRouter from "./routes/authorsRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/", booksRouter);
app.use("/genres", genresRouter);
app.use("/authors", authorsRouter);

const port = 3000;

app.listen(port, ()=>{
    console.log(`running at port: ${port}`)
})