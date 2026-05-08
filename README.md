# Spot the Fish

[Українська версія](./README.uk.md)

Desktop-only Ukrainian anti-phishing learning game.

Built with Next.js, React, TypeScript, Tailwind CSS, static JSON lesson data, and `localStorage` progress.

No email accounts. No passwords. No payments. No leaderboards. No personal data collection.

By default, the app works fully locally through `localStorage`. Optional Supabase-backed access-code sync can be enabled with environment variables.

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
- optional 16-digit access-code progress sync
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

Progress is stored in `localStorage` by default.

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

Optional sync uses a 16-digit numeric access code. It does not use Supabase Auth, email, usernames, or passwords. Supabase is used only as Postgres storage through server-only route handlers.

To enable sync, provide:

```text
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ACCOUNT_LOOKUP_SECRET=
SESSION_PASSWORD=
```

These are needed only for access-code sync. The game still works without them in localStorage-only mode. Never commit `.env.local` or real secrets.

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Bun
- localStorage
- optional Supabase Postgres sync

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

There are no email/password user accounts.

Progress is saved in the browser through `localStorage`. Clearing browser/site data removes progress.

If optional access-code sync is configured, progress can also be saved to Supabase under a random 16-digit code. Raw access codes are not stored.

## License

BSD 3-Clause License. See [LICENSE](./LICENSE).
