const fs = require("fs");
const path = require("path");

const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

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

  posts.push({
    title: data.title,

    description: data.description || "",

    date: data.date,

    tags: data.tags || [],

    slug: slug,

    draft: data.draft || false,
  });
}

posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(
  path.join(OUTPUT_DIR, "posts.json"),

  JSON.stringify(posts, null, 4)
);

// ==============================
// Generate tags.json
// ==============================

const tags = {};

for (const post of posts) {
  for (const tag of post.tags) {
    if (!tags[tag]) {
      tags[tag] = [];
    }

    tags[tag].push({
      title: post.title,

      slug: post.slug,

      description: post.description,

      date: post.date,
    });
  }
}

fs.writeFileSync(
  path.join(OUTPUT_DIR, "tags.json"),

  JSON.stringify(tags, null, 4)
);

console.log(`Generated ${Object.keys(tags).length} tags.`);

console.log(`Generated ${posts.length} posts.`);
