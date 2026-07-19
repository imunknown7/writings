---
title: Using quill.
date: 2026-07-17
description: A guide on writing posts, using frontmatter, and managing content in quill.
tags:
  - general
  - misc
  - guide
draft: false
---

# Hello!

Quill is a markdown-powered personal blog built around a simple idea:
**Write in Markdown. Build. Publish.**
Posts are written as `.md` files, processed by the build system, and converted into static HTML pages.

## Posting your blog
make sure to use the following as frontmatter for any of your blog posts
```yaml
---
title: "My New Post"
date: "2026-07-17"
description: "A short description of the post."
tags:
  - programming
  - javascript
---
```

## Quote

> even quotes can be blogged!

## Code
Codeblocks are supported too!
`const x = 5`

```js
function greet() {
  console.log("Hello World");
}
```

## Image

![](../../../assets/images/pfp.png)

## Table
You can make tables as well!
| Name | Language   |
| ---- | ---------- |
| quill | JavaScript |
| Blog | Markdown   |


View [template](../template/)
