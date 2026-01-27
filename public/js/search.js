document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");
    const resultsContainer = document.getElementById("search-results");
    const overlay = document.querySelector(".overlay");
    const burgerMenuBtn = document.querySelector(".burger-menu-btn");
    const linksBox = document.querySelector(".navbar-mobile-link-list");

    burgerMenuBtn.addEventListener("click", (e) => {
        e.preventDefault();
        linksBox.style.display = "flex";
        document.querySelector("body").style.overflow = "hidden";
    })

    document.querySelector(".close-modal-btn").addEventListener("click", (e) => {
        e.preventDefault();
        linksBox.style.display = "none"
        document.querySelector("body").style.overflow = "auto";
    })


    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const query = input.value.trim();
        if (!query) {
            resultsContainer.innerHTML = "";
            return;
        }

        try {
            const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            resultsContainer.innerHTML = "";

            const {searchResult} = data;

            resultsContainer.addEventListener("click", (e) => {
                const closeSearchBtn = e.target.closest(".close-search");
                if (!closeSearchBtn) return;
                e.preventDefault();
                resultsContainer.innerHTML = "";
                resultsContainer.style.display = "none";
                resultsContainer.classList.remove("active");
                overlay.classList.remove("overlay-active");
            })

            if (searchResult.length === 0) {
                resultsContainer.innerHTML = ` <div class='flex-end'> <button class='close-search'> <img src="/images/other/close.png" alt="close button icon" width="15" height="15"> </button> </div> <p>Nothing found</p>`;
                resultsContainer.classList.add("active");
                resultsContainer.style.display = "flex";
                overlay.classList.add("overlay-active");


            } else {
                resultsContainer.innerHTML = "<div class='flex-end'><button class='close-search'> <img src=\"/images/other/close.png\" alt=\"close button icon\" width=\"15\" height=\"15\"></button> </div>"
                resultsContainer.classList.add("active");
                overlay.classList.add("overlay-active");
                resultsContainer.style.display = "flex";

                searchResult.forEach(item => {
                    const div = document.createElement("div");
                    div.innerHTML = `
          <strong>${item.book_name}</strong> by ${item.author_first_name} ${item.author_last_name}
        `;

                    div.style.cursor = "pointer";

                    div.addEventListener("click", () => {
                        resultsContainer.innerHTML = "";
                        resultsContainer.style.display = "none";
                        resultsContainer.classList.remove("active");
                        overlay.classList.remove("overlay-active");
                        window.location.href = `/#book-${item.book_id}`;
                    });
                    resultsContainer.appendChild(div);
                });
            }

        } catch (err) {
            console.error("Search error:", err);
            resultsContainer.innerHTML = "<p>Error during search</p>";
        }
    });
});