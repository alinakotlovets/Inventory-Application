import {Router} from "express";
import {searchData} from "../controllers/searchController.js";

const searchRouter = Router();

searchRouter.get("/", searchData);

export default searchRouter;