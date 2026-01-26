document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");
    const resultsContainer = document.getElementById("search-results");

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

            if (searchResult.length === 0) {
                resultsContainer.innerHTML = "<p>Nothing found</p>";
                return;
            }

            searchResult.forEach(item => {
                const div = document.createElement("div");
                div.innerHTML = `
          <strong>${item.book_name}</strong> by ${item.author_first_name} ${item.author_last_name}
        `;

                div.style.cursor = "pointer";

                div.addEventListener("click", () => {
                    resultsContainer.innerHTML = "";
                    window.location.href = `/#book-${item.book_id}`;
                });
                resultsContainer.appendChild(div);
            });
        } catch (err) {
            console.error("Search error:", err);
            resultsContainer.innerHTML = "<p>Error during search</p>";
        }
    });
});