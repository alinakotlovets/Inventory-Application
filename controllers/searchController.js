import {searchInDb} from "../db/queries.js";

export async function searchData(req, res) {
    const searchValue = req.query.q || "";
    const searchResult = await searchInDb(searchValue);
    return res.status(200).json({
        searchResult: searchResult
    })
}