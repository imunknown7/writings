const container = document.getElementById("topics-list");

async function loadTopics() {
  const response = await fetch("generated/tags.json");

  const tags = await response.json();

  tags.sort((a, b) => b.count - a.count);

  container.innerHTML = "";

  tags.slice(0, 6).forEach((tag) => {
    const item = document.createElement("a");

    item.className = "topic";

    item.href = `tag.html?tag=${encodeURIComponent(tag.name)}`;

    item.innerHTML = `

            <span>${tag.name}</span>

            <small>${tag.count} posts</small>

        `;

    container.appendChild(item);
  });
}

loadTopics();
