# Spot the Fish

[Українська версія](./README.uk.md)

Desktop-only Ukrainian anti-phishing learning game.

Built with Next.js, React, TypeScript, Tailwind CSS, static JSON lesson data, and `localStorage` progress.

No accounts. No backend. No payments. No leaderboards. No personal data collection.

## What it does

Spot the Fish teaches users how to recognize online scams through short interactive lessons.

The target audience is non-technical Ukrainian users, especially adults and moms.

The mascot is **Фішко**, a blue fish detective.

## Features

- landing page
- lesson map
- lesson intro pages
- interactive lesson pages
- lesson completion pages
- safety tips library
- local settings page
- local-only progress saving
- randomized Fishko mascot variants
- Ukrainian educational copy

## Lessons

The game has:

- 16 lessons
- 4 modules
- 238 total questions

Modules:

- Підозрілі повідомлення
- Посилання і сайти
- Популярні сервіси
- Безпечні дії

Covered topics include:

- fake support
- SMS codes
- giveaways
- suspicious links
- fake websites
- QR payments
- fake login pages
- OLX scams
- Telegram scams
- Viber scams
- delivery scams
- banking traps
- family money requests
- safe verification behavior

## Game types

- click suspicious message parts
- choose real/fake message cards
- pick the safest action
- identify safe or suspicious links

## Progress

Progress is stored only in `localStorage`.

Tracked data includes:

- completed lessons
- unlocked lessons
- scores
- stars
- streak
- text size
- sound setting
- language setting

Completing a lesson unlocks the next one.  
Replaying a lesson can improve the saved score.

Settings include a reset confirmation.

There is also a hidden easter egg: clicking `Українська` 20 times unlocks all lessons.

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Bun
- localStorage

## Run locally

```bash
bun install
bun run dev
````

Open:

```text
http://localhost:3000
```

## Production build

```bash
bun run build
bunx next start -H 0.0.0.0 -p 3000
```

## Local network

To expose the site on your local network:

```bash
bunx next start -H 0.0.0.0 -p 3000
```

Find your LAN IP:

```bash
ip a
```

Then open from another device on the same network:

```text
http://YOUR_LOCAL_IP:3000
```

## Project structure

```text
app/          Next.js routes
assets/       images, mascot assets, icons
components/   UI components
data/         lesson and question data
lib/          helper logic
scripts/      utility scripts
```

## Development note

This project was developed with agentic coding tools. Expect bugs, rough edges, and occasional questionable decisions. Review changes before trusting them.

## Privacy

There are no user accounts and no server-side user storage.

Progress is saved in the browser through `localStorage`. Clearing browser/site data removes progress.

## License

BSD 3-Clause License. See [LICENSE](./LICENSE).
