import {
    getAllAuthorsFromBd,
    addAuthorsToBd,
    updateAuthorsInDb,
    getAuthorById,
    deleteAuthorFromBb
} from "../db/queries.js";
import 'dotenv/config';
import {body, matchedData, validationResult} from "express-validator";

export const authorValidation = [
    body("firstName")
        .trim()
        .isAlpha().withMessage("first name must only contains letter of en alphabet")
        .isLength({min: 2}).withMessage("first name must have at least 2 latter"),
    body("lastName")
        .trim()
        .isAlpha().withMessage("last name must only contains letter of en alphabet")
        .isLength({min: 2}).withMessage("last name must have at least 2 latter")
];

export async function getAllAuthors(req, res) {
    const authors = await getAllAuthorsFromBd();
    if (!authors) {
        throw new Error("not found");
    }
    res.render("authors", {authors});
}

export function getAddAuthor(req, res) {
    res.render("addAuthor", {
        errors: [],
        lastNameInput: "",
        firstNameInput: "",
    });
}

export async function addAuthor(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("addAuthor", {
            errors: errors.array(),
            lastNameInput: req.body.lastName,
            firstNameInput: req.body.firstName
        })
    }

    const {firstName, lastName} = matchedData(req);
    await addAuthorsToBd(firstName, lastName);
    res.redirect("/authors");
}


export async function getUpdateAuthor(req, res) {
    const {authorId} = req.params;
    const author = await getAuthorById(Number(authorId));
    if (!author) {
        throw new Error("author not found");
    }
    res.render("updateAuthor", {
        authorId: authorId,
        authorLastName: author[0].author_last_name,
        authorFirstName: author[0].author_first_name
    });
}


export async function confirmUpdateAuthor(req, res) {
    const {authorId} = req.params;
    const {confirmPassword} = req.body;

    if (confirmPassword.trim() !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({message: "Password incorrect"});
    }

    return res.status(200).json({
        redirectTo: `/authors/update/${authorId}`
    });
}

export async function updateAuthor(req, res) {
    const {authorId} = req.params;
    const {confirmPassword, firstName, lastName} = req.body;
    if (confirmPassword.trim() !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({message: "Password incorrect"});
    }
    await updateAuthorsInDb(authorId, firstName, lastName);
    return res.status(200).json({redirectTo: "/authors"});
}


export async function postAuthorValidation(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    return res.status(200).json({
        errors: [],
    })
}


export async function deleteAuthor(req, res) {
    const {authorId} = req.params;
    const {confirmPassword} = req.body;
    if (!confirmPassword) {
        return res.status(400).json({
            message: "Password is required"
        });
    }
    if (confirmPassword.trim() !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({
            message: "Password incorrect!"
        });
    }
    await deleteAuthorFromBb(authorId);

    return res.status(200).json({
        message: "Author deleted",
        redirectTo: "/authors"
    });
}