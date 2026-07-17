const container = document.getElementById("posts-list");
const search = document.getElementById("search");

let posts = [];

async function loadPosts() {
  const response = await fetch("generated/posts.json");

  posts = await response.json();

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  render(posts);
}

function render(list) {
  container.innerHTML = "";

  list.forEach((post) => {
    const article = document.createElement("article");

    article.className = "post";

    article.innerHTML = `

            <time class="post-date">

                ${formatDate(post.date)}

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
  const query = search.value.toLowerCase();

  render(
    posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.join(" ").toLowerCase().includes(query)
    )
  );
});

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",

    month: "short",

    day: "numeric",
  });
}

loadPosts();
