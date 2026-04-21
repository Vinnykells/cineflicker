# Cineflicker 🎬

<div align="center">
  <img src="screenshots/Cineficker Hero.png" width="600" />
  <img src="screenshots/Cineficker Hero Mobile.png" width="200" />
</div>

A movie and TV show discovery app built with Next.js 14. Uses the TMDB API to show trending, popular, and top rated content.

## Features

- Trending movies and TV shows
- Movie & show detail pages with cast, trailer link, and similar titles
- Search across movies and TV shows
- Auto-rotating hero section
- Fully responsive

<div align="center">
  <img src="screenshots/Cineflicker Catalogs.png" width="600" />
  <img src="screenshots/Cineflicker Catalogs Mobile.png" width="200" />
</div>

<div align="center">
  <img src="screenshots/Cineflicker Search.png" width="600" />
  <img src="screenshots/Cineflicker Search Mobile.png" width="200" />
</div>

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Framer Motion
- TMDB API

## Getting Started

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_TMDB_API_KEY=your_api_key
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_URL=https://image.tmdb.org/t/p
```

Then run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API

Data is sourced from [The Movie Database (TMDB)](https://www.themoviedb.org/). You'll need a free API key from their site.
