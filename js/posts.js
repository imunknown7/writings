const container = document.getElementById("posts-list");
const search = document.getElementById("search");

let posts = [];

async function loadPosts() {
  const response = await fetch("generated/posts.json");

  posts = await response.json();

  posts.sort((a, b) => new Date(b.created) - new Date(a.created));

  render(posts);
}

function render(list) {
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = `
        <p class="no-results">
            No posts found.
        </p>
    `;

    return;
  }
  list.forEach((post) => {
    const article = document.createElement("article");

    article.className = "post";

    article.innerHTML = `

            <time class="post-date">

              ${formatDate(post.created)}

            </time>

            <div class="post-info">

                <a href="generated/posts/${post.slug}/">

                    <h3 class="post-title">

                        ${post.title}

                    </h3>

                </a>

                <p class="post-description">

                    ${post.description}

                </p>

                <div class="post-tags">

                    ${post.tags
                      .map(
                        (tag) =>
                          `<a class="tag" href="tag.html?tag=${encodeURIComponent(
                            tag
                          )}">${tag}</a>`
                      )
                      .join("")}

                </div>

            </div>

        `;

    container.appendChild(article);
  });
}

search.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase();

  render(
    posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  );
});

function formatDate(date) {
  console.log("formatDate received:", date);
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",

    month: "short",

    day: "numeric",
  });
}

loadPosts();

document.addEventListener("keydown", (e) => {
  if (e.key === "/") {
    e.preventDefault();

    search.focus();
  }
});
