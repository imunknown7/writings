const params = new URLSearchParams(window.location.search);

const currentTag = params.get("tag");

const title = document.getElementById("tag-title");

const count = document.getElementById("tag-count");

const postsList = document.getElementById("posts-list");

async function loadTag() {
  const response = await fetch("generated/tags.json");

  const tags = await response.json();

  const tag = tags.find((t) => t.name === currentTag);

  if (!tag) {
    title.textContent = "Tag not found";

    return;
  }

  title.textContent = tag.name;

  count.textContent = `${tag.count} post${tag.count !== 1 ? "s" : ""}`;

  tag.posts.forEach((post) => {
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

            </div>

        `;

    postsList.appendChild(article);
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",

    month: "short",

    year: "numeric",
  });
}

loadTag();
