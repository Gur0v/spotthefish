# Spot the Fish

[Українська версія](./README.uk.md)

Spot the Fish is a desktop-first Ukrainian anti-phishing learning game that also works on phones. It teaches people to recognize online scams through short, friendly lessons with practical examples.

The mascot is **Фішко**, a blue fish detective.

## Highlights

- 16 lessons across 4 modules
- 238 Ukrainian questions
- Desktop-first responsive UI
- Local progress through `localStorage`
- Optional private access-code sync
- No email, usernames, passwords, payments, profiles, or leaderboards

## Lessons

Modules:

| # | Module |
|---|--------|
| 1 | Підозрілі повідомлення |
| 2 | Посилання і сайти |
| 3 | Популярні сервіси |
| 4 | Безпечні дії |

Covered topics include fake support, SMS codes, suspicious links, fake websites, QR payment traps, OLX scams, Telegram scams, Viber scams, delivery scams, banking traps, family money requests, and safe verification behavior.

## Gameplay

Question types:

- click suspicious message parts
- choose the real or fake message
- pick the safest action
- identify safe or suspicious links

Completing a lesson unlocks the next one. Replaying a lesson can improve the saved score.

## Progress And Privacy

By default, progress is saved only in the browser via `localStorage`.

Optional sync uses a 16-digit numeric access code. It does not use Supabase Auth, email, usernames, or passwords. Supabase is used only as Postgres storage through server-only route handlers.

Stored sync data is limited to progress and settings:

- completed and unlocked lessons
- scores, stars, and streak
- language, text size, and sound setting

Raw access codes are never stored. The database stores an HMAC lookup hash and a secret hash for verification.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Bun
- static JSON lesson data
- optional Supabase Postgres sync

## Environment

The app works without Supabase env vars in localStorage-only mode.

Access-code sync needs:

```text
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ACCOUNT_LOOKUP_SECRET=
SESSION_PASSWORD=
```

Never commit `.env.local` or real secrets.

## Run Locally

```bash
bun install
bun run dev
```

Then open `http://localhost:3000`.

## Build

```bash
bun run build
bunx next start -H 0.0.0.0 -p 3000
```

## Access-Code Smoke Test

Run this against a started server with sync env vars configured:

```bash
bun run smoke:access http://localhost:3000
```

It tests create, session check, save progress, load progress, logout, login, reload progress, and delete access account.

## Local Network

```bash
bunx next start -H 0.0.0.0 -p 3000
ip a
```

Then visit `http://YOUR_LOCAL_IP:3000` from another device on the same network.

## Project Structure

```text
app/          Next.js routes
assets/       images, mascot assets, icons
components/   UI components
data/         lesson and question data
lib/          helper logic
scripts/      utility scripts
```

## License

BSD 3-Clause. See [LICENSE](./LICENSE).
