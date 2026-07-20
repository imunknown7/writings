const postsContainer = document.getElementById("posts-list");

async function loadPosts() {

    const response = await fetch("generated/posts.json");
    const posts = await response.json();

    posts.sort((a, b) => new Date(b.created) - new Date(a.created));

    posts.slice(0, 5).forEach(post => {

        const article = document.createElement("article");
        article.className = "post";

        article.innerHTML = `
            <time class="post-date">
                ${formatDate(post.created)}
            </time>

            <div class="post-info">

                <a href="generated/posts/${post.slug}/">
                    <h3 class="post-title">${post.title}</h3>
                </a>

                <p class="post-description">
                    ${post.description}
                </p>

            </div>
        `;

        postsContainer.appendChild(article);

    });

}

function formatDate(dateString) {

    return new Date(dateString).toLocaleDateString("en-US", {

        day: "numeric",
        month: "short",
        year: "numeric"

    });

}

loadPosts();