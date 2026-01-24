const authorsList = document.getElementById("authors-list");
const genresList = document.getElementById("genres-list");
const booksList = document.getElementById("books-list");
const submitEditGenreBtn = document.getElementById("edit-genre-submit");
const submitEditAuthorBtn = document.getElementById("edit-author-submit");
const submitEditBookBtn = document.getElementById("edit-book-submit");
const editBookForm = document.getElementById("editBookForm");
const confirmForm = document.querySelector(".confirm-form");
const confirmFormLabel = document.querySelector(".confirm-form-label");
const confirmFormCancelBtn = document.querySelector(".confirm-form-cancel-btn");
const errorMessage = document.querySelector(".confirm-form-error-messages");


let pendingFormData = null;

if (authorsList) {
    authorsList.addEventListener("click", (e) => {
        const deleteBtn = e.target.closest(".delete-author-btn");
        if (!deleteBtn) return;
        e.preventDefault();
        const authorId = deleteBtn.dataset.authorId;
        confirmFormLabel.innerHTML = 'Write password for confirm that you have permission for deleting content. Be aware that deleting author would also delete all books of this author';
        confirmForm.action = `/authors/delete/${authorId}`;
        confirmForm.style.display = "block";
    });
}

if (genresList) {
    genresList.addEventListener("click", (e) => {
        const deleteBtn = e.target.closest(".delete-genre-btn");
        if (!deleteBtn) return;
        e.preventDefault();
        const genreId = deleteBtn.dataset.genreId;
        confirmFormLabel.innerHTML = 'Write password for confirm that you have permission for deleting content. Be aware that deleting genre would remove it from all books, but if some books has only this genre it will delete this books.';
        confirmForm.action = `/genres/delete/${genreId}`;
        confirmForm.style.display = "block";
    })
}


if (submitEditGenreBtn) {
    submitEditGenreBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const genreId = e.target.dataset.genreId;
        const genreName = document.getElementById("genreName").value;
        const res = await fetch(`/genres/update/${genreId}/validate`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({genreName})
        });
        const data = await res.json();

        if (!res.ok) {
            document.querySelector(".validation-error-messages").textContent = data.errors.map(e => e.msg).join(", ");
            return;
        }
        pendingFormData = {genreName};
        confirmFormLabel.innerHTML = 'Write password for confirm that you have permission for updating content.';
        confirmForm.action = `/genres/update/${genreId}`;
        document.querySelector(".validation-error-messages").textContent = "";
        confirmForm.style.display = "block";
    });
}

if (submitEditAuthorBtn) {
    submitEditAuthorBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const authorId = e.target.dataset.authorId;
        pendingFormData = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
        };
        const res = await fetch(`/authors/update/${authorId}/validate`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(pendingFormData)
        });

        const data = await res.json();

        if (!res.ok) {
            document.querySelector(".validation-error-messages").textContent = data.errors.map(e => e.msg).join(", ");
            return;
        }
        confirmFormLabel.innerHTML = 'Write password for confirm that you have permission for updating content.';
        confirmForm.action = `/authors/update/${authorId}/`;
        document.querySelector(".validation-error-messages").textContent = "";
        confirmForm.style.display = "block";
    })
}

if (booksList) {
    booksList.addEventListener("click", (e) => {
        const deleteBtn = e.target.closest(".delete-book-btn");
        if (!deleteBtn) return;
        e.preventDefault();
        const bookId = deleteBtn.dataset.bookId;
        confirmFormLabel.innerHTML = 'Write password for confirm that you have permission for deleting content.';
        confirmForm.action = `/delete/${bookId}`;
        confirmForm.style.display = "block";
    })

}


if (submitEditBookBtn && editBookForm) {
    submitEditBookBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const bookId = e.target.dataset.bookId;
        const formData = new FormData(editBookForm);

        const res = await fetch(`/update/${bookId}/validate`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            document.querySelector(".validation-error-messages").textContent =
                data.errors.map(e => e.msg).join(", ");
            return;
        }

        pendingFormData = formData;
        confirmFormLabel.innerHTML = "Write password for confirm that you have permission for updating content.";
        confirmForm.action = `/update/${bookId}`;
        document.querySelector(".validation-error-messages").textContent = "";
        confirmForm.style.display = "block";
    });
}

confirmFormCancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    confirmFormLabel.innerHTML = "Confirm action by writing password";
    confirmForm.action = "";
    errorMessage.textContent = "";
    document.getElementById("confirmPassword").value = "";
    confirmForm.style.display = "none";

})


confirmForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isFormData = pendingFormData instanceof FormData;
    if (isFormData) {
        pendingFormData.append(
            "confirmPassword",
            document.getElementById("confirmPassword").value
        );
        response = await fetch(confirmForm.action, {
            method: "POST",
            body: pendingFormData
        });
    } else {
        response = await fetch(confirmForm.action, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                confirmPassword: document.getElementById("confirmPassword").value,
                ...pendingFormData
            })
        });
    }
    const data = await response.json();
    if (!response.ok) {
        errorMessage.textContent = data.message;
        return;
    }

    if (data.redirectTo) {
        pendingFormData = null;
        confirmForm.style.display = "none";
        document.getElementById("confirmPassword").value = "";
        window.location = data.redirectTo;
    }
});

