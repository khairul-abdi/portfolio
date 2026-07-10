# Khairul Abdi Dongoran Portfolio

Modern responsive portfolio built with Vite, React, and plain CSS.

## Requirements

- Node.js 20 or newer
- npm

## Install

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://127.0.0.1:5173
```

On Windows PowerShell, use this if `npm` is blocked by execution policy:

```powershell
npm.cmd run dev
```

## Build Production

```bash
npm run build
```

Production files are generated in:

```text
dist/
```

## Preview Production Build

```bash
npm run preview
```

## Deploy

```bash
npm run deploy
```

The deploy script builds the project first, then publishes `dist/` with `gh-pages`.

## Project Structure

```text
src/components/       Shared UI components
src/pages/            Home, About, Work, Contact pages
src/data/portfolio.js Portfolio profile, skills, experience, and project data
src/styles.css        Main responsive styling
public/               Static assets used by Vite
```

## Update Content

Edit:

```text
src/data/portfolio.js
```

Use this file to update profile details, skills, work experience, education, ATS keywords, project links, and carousel galleries.

## Add Project With Carousel

Put screenshots in:

```text
public/images/projects/my-project/
```

Then add a project item in `src/data/portfolio.js`:

```js
{
  name: "My Project",
  category: "Backend Developer",
  image: "images/projects/my-project/1.png",
  gallery: projectGallery("my-project", ["1.png", "2.png", "3.png"]),
  demo: "https://example.com",
  source: "https://github.com/username/repo",
  description: "Short project description.",
  stack: ["Golang", "PostgreSQL", "Redis"],
}
```

The `image` field is used as the card preview. The `gallery` field controls the popup carousel images.

## Icons And Logo

The main source icon is:

```text
public/favicon.png
```

The generated favicon/app icon files are also stored in `public/` and copied to `dist/` during build.
