# Darshan Kushalkar — Portfolio

Personal portfolio website showcasing my work as a **Full-Stack Developer**. Built with Next.js, TypeScript, and Tailwind CSS.

**Live:** Set `NEXT_PUBLIC_URL` in production  
**Repository:** [github.com/DarshanCodes09/My-Portfolio](https://github.com/DarshanCodes09/My-Portfolio)

---

## About

I'm **Darshan Kushalkar**, a full-stack developer from India. I build web products end-to-end — from AI automation platforms to attendance systems — with a focus on clean UI, performance, and developer experience.

This portfolio includes:

- Hero with rotating roles, GitHub contribution graph, and Spotify now-playing
- Featured projects and work experience
- Telegram-powered contact form
- Command palette navigation (`Ctrl+K`)
- Dark/light theme support

---

## Tech Stack

| Layer      | Technologies                     |
| ---------- | -------------------------------- |
| Framework  | Next.js 15, React 19, TypeScript |
| Styling    | Tailwind CSS 4, Framer Motion    |
| UI         | shadcn/ui, Radix UI              |
| Forms      | React Hook Form, Zod             |
| Contact    | Telegram Bot API                 |
| Analytics  | Umami (optional)                 |
| Deployment | Vercel                           |

---

## Features

- **Single config source** — all personal info in `src/config/Site.ts`
- **Project showcase** — premium 3D hover cards on `/projects`
- **Contact form** — validates input, rate-limits spam, delivers via Telegram
- **SEO** — Open Graph, Twitter cards, JSON-LD, sitemap, robots.txt, web manifest
- **Command palette** — keyboard shortcuts for navigation and actions
- **GitHub activity** — contribution graph with hover tooltips

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/contact/        # Telegram contact form handler
│   ├── projects/           # Projects showcase page
│   ├── blog/               # Blog (coming soon)
│   └── ...
├── components/
│   ├── common/             # Navbar, Footer, Container
│   ├── landing/            # Home page sections
│   ├── projects/           # Project showcase cards
│   ├── contact/            # Contact form
│   ├── command-palette/    # Cmd+K palette
│   └── ui/                 # shadcn/ui primitives
├── config/
│   ├── Site.ts             # ⭐ Central personal config (edit this)
│   ├── Meta.tsx            # SEO metadata generator
│   ├── Projects.tsx        # Project data
│   ├── Experience.tsx      # Work history & featured projects
│   ├── TechStack.ts        # Tech icons
│   ├── Navbar.tsx          # Navigation links
│   └── Footer.tsx          # Footer content
├── hooks/
└── types/
public/
├── assets/logo.png         # Avatar & favicon
└── project/                # Project thumbnails
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm or bun

### 1. Clone & install

```bash
git clone https://github.com/DarshanCodes09/My-Portfolio.git
cd My-Portfolio
npm install
```

### 2. Environment variables

Create `.env.local`:

```env
# Site URL (required for SEO in production)
NEXT_PUBLIC_URL=http://localhost:3000

# Telegram contact form
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Optional: Spotify now-playing widget
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=

# Optional: Umami analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_URL=
```

**Telegram setup:**

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Send a message to your bot
3. Get your chat ID from `https://api.telegram.org/bot<TOKEN>/getUpdates`

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build

```bash
npm run build
npm start
```

---

## Deployment

Recommended: [Vercel](https://vercel.com)

1. Push to GitHub
2. Import the repository in Vercel
3. Add environment variables in the Vercel dashboard
4. Set `NEXT_PUBLIC_URL` to your production domain (e.g. `https://darshan.dev`)

---

## Customization Guide

**Most changes only require editing `src/config/Site.ts`:**

| What to change                 | File                                          |
| ------------------------------ | --------------------------------------------- |
| Name, bio, email, social links | `src/config/Site.ts`                          |
| Projects list                  | `src/config/Projects.tsx`                     |
| Work experience                | `src/config/Experience.tsx`                   |
| Tech stack icons               | `src/config/TechStack.ts`                     |
| Navigation links               | `src/config/Navbar.tsx`                       |
| SEO per page                   | `src/config/Meta.tsx`                         |
| Project thumbnails             | `public/project/`                             |
| Avatar / favicon               | `public/assets/logo.png` + `src/app/icon.png` |

---

## License

MIT — see [LICENSE](LICENSE) if present, or use freely with attribution.

---

## Contact

- **Email:** [thedarshan.dev@gmail.com](mailto:thedarshan.dev@gmail.com)
- **GitHub:** [@DarshanCodes09](https://github.com/DarshanCodes09)
- **X:** [@thedarshan_dev](https://x.com/thedarshan_dev)
- **LinkedIn:** [Darshan Kushalkar](https://www.linkedin.com/in/darshan-kushalkar-2919aa234/)
- **Medium:** [@darshan.kushal321](https://medium.com/@darshan.kushal321)
