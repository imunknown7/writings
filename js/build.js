const fs = require("fs");
const path = require("path");

const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");

async function build() {
  // Import ESM packages dynamically
  const { default: Shiki } = await import("@shikijs/markdown-it");

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  md.use(
    await Shiki({
      themes: {
        light: "github-dark",
        dark: "github-dark",
      },
    })
  );

  const POSTS_DIR = path.join(__dirname, "..", "posts");
  const OUTPUT_DIR = path.join(__dirname, "..", "generated");
  const TEMPLATE = path.join(__dirname, "..", "templates", "post.html");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  const POSTS_OUTPUT = path.join(OUTPUT_DIR, "posts");

  if (!fs.existsSync(POSTS_OUTPUT)) {
    fs.mkdirSync(POSTS_OUTPUT);
  }

  const template = fs.readFileSync(TEMPLATE, "utf8");

  const files = fs.readdirSync(POSTS_DIR);

  const posts = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const slug = file.replace(".md", "");

    const fullPath = path.join(POSTS_DIR, file);

    const raw = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(raw);

    if (data.draft === true) continue;

    const html = md.render(content);
    const finalHTML = template
      .replace(/{{title}}/g, data.title)
      .replace(/{{date}}/g, data.date)
      .replace(/{{content}}/g, html);

    const postFolder = path.join(POSTS_OUTPUT, slug);

    if (!fs.existsSync(postFolder)) {
      fs.mkdirSync(postFolder);
    }

    fs.writeFileSync(path.join(postFolder, "index.html"), finalHTML);

    const postDate = new Date(data.date);

    posts.push({
      title: data.title,
      description: data.description || "",
      date: data.date,
      timestamp: postDate.getTime(),
      tags: data.tags || [],
      slug,
      draft: data.draft || false,
    });
  }

  posts.sort((a, b) => b.timestamp - a.timestamp);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "posts.json"),
    JSON.stringify(posts, null, 4)
  );

  // ==========================
  // Generate tags.json
  // ==========================

  const tagMap = {};

  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagMap[tag]) {
        tagMap[tag] = {
          name: tag,
          count: 0,
          posts: [],
        };
      }

      tagMap[tag].count++;

      tagMap[tag].posts.push({
        title: post.title,
        slug: post.slug,
        description: post.description,
        date: post.date,
        timestamp: post.timestamp,
      });
    }
  }

  const tags = Object.values(tagMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  for (const tag of tags) {
    tag.posts.sort((a, b) => b.timestamp - a.timestamp);
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "tags.json"),
    JSON.stringify(tags, null, 4)
  );

  console.log(`Generated ${posts.length} posts.`);
  console.log(`Generated ${tags.length} tags.`);
}

build().catch(console.error);
