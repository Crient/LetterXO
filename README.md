# LetterXO

LetterXO is a Valentine experience where a host creates a private link, the receiver fills it out, and the host views the response — all wrapped in a cute, shareable UI.

---

## Why I Built This

I want to ask my valentine out this year with this. Last year I built a Google Slide, but now I want to make it into an actual website that people can also use to send to their valentines :)

---

## Features

### Host Flow
- Create a Valentine with names, emails, and an optional message
- Generate two private links:
  - Receiver link (edit token)
  - Results link (view token)
- Draft email/message modal + “Open in Gmail” option

### Receiver Flow
- Open the receiver link and play through the experience
- Choose vibe, plan, and food
- Add an optional note
- Submit the response

### Results Flow
- Host opens results link to see the response summary
- Copy results link or draft a response email
- Replay the experience

### Security & Guardrails
- Supabase service role key only used in serverless functions
- Per-record capability tokens (edit/view)
- Rate limiting on create/respond endpoints
- Input validation + HTML tag blocking
- No “list all rows” endpoints
- Tight CORS for API routes

---

## User Flow
```
Host: Create → Generate Links → Share Receiver Link
Receiver: Open Link → Experience → Submit
Host: Open Results Link → View Summary
```

---

## Tech Stack
- React + Vite
- Tailwind CSS
- React Router
- Supabase (Postgres)
- Vercel Serverless Functions
- Browser APIs: Canvas, LocalStorage

---

## Getting Started

### Environment Variables
Create a `.env.local` and set the same values in Vercel:
```
SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
APP_ORIGIN=https://your-domain.vercel.app
```

### Supabase SQL (Table + Indexes + RLS)
Paste this into the Supabase SQL Editor:
```
create extension if not exists "pgcrypto";

create table if not exists public.valentines (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  sender_email text,
  receiver_name text not null,
  receiver_email text,
  letter_message text,
  view_token text not null,
  edit_token text not null,
  vibe text,
  main_plan text,
  food text,
  place_text text,
  place_pref text,
  receiver_note text,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists valentines_edit_token_idx on public.valentines (edit_token);
create index if not exists valentines_view_token_idx on public.valentines (view_token);
create index if not exists valentines_created_at_idx on public.valentines (created_at);

alter table public.valentines enable row level security;
revoke all on public.valentines from anon, authenticated;
```

### Local Development
```bash
npm install
npm run dev      # frontend only
vercel dev       # full stack (API routes)
```

---

## Email Drafts
- “Draft email / message” opens a modal with a clickable “click here” link.
- “Open in Gmail” uses Gmail’s compose URL (plain text body only).

---

## License
MIT © 2026 Gechleng Lim
