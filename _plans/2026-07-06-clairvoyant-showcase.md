# Clairvoyant Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/clairvoyant/` landing page, an announcement post, and a projects-index entry to sreekar.ch showcasing the Clairvoyant glasses + relay project, with the install section stubbed until artifacts ship.

**Architecture:** Static Jekyll content in EarthBug.github.io following the SuCor showcase precedent — a `_pages/*.html` page with `layout: default` and its own stylesheet under `assets/clairvoyant/`, plus a markdown post in `_posts/`. No new JS; the site-wide `scroll-reveal.js` animates `.reveal` sections.

**Tech Stack:** Jekyll (GitHub Pages, builds to `docs/`), plain HTML/CSS using the site's CSS custom properties (`--bg --fg --fg-dim --fg-mute --line --line-soft --accent --mono --sans --maxw --pad`).

## Global Constraints

- Never write into `docs/` — it is the build output GitHub Pages serves.
- No external assets (fonts, CDNs); no new JavaScript files.
- Page must degrade with JS disabled (`.reveal` is progressive enhancement).
- Install section: every artifact link is a stub (`href="#"`) with a visible "coming soon" badge; mailto early-access fallback to srchig@iu.edu.
- Copy facts come from the spec `_specs/2026-07-06-clairvoyant-page-design.md` (credential never leaves host; glasses get only host+port+token; LAN-only; fail-open; PreToolUse hook; WebSocket transcript stream; QR pairing).
- Work on branch `clairvoyant-page` off `master`.

---

### Task 1: Landing page `/clairvoyant/`

**Files:**
- Create: `_pages/clairvoyant.html` (front matter: `layout: default`, `permalink: /clairvoyant/`, `title: Clairvoyant`, `description` for SEO)
- Create: `assets/clairvoyant/clairvoyant.css`

**Structure (mirrors sucor.html conventions: wrapper div scoping the CSS, `su-`-style prefixed classes — use `cv-` prefix, `.reveal` on each section):**

1. **Hero** — meta chips (`in active development`, `Android · smart glasses`, `local relay`, `LAN-only`); kicker `Claude Code on your glasses`; h1 `Approve your agent from anywhere in the house — Clairvoyant.` (gradient span like `.su-grad`); lede: Clairvoyant streams your running Claude Code sessions to camera-equipped smart glasses and lets you approve or deny tool permissions with a glance — while your credentials never leave your machine. CTAs: primary `Install ↓` → `#install`, ghost `How it works ↓` → `#how`; sub note `open source · APK + npm relay`.
2. **How it works** (`#how`) — pure-HTML/CSS architecture diagram: three nodes (`Terminal — claude`, `Relay — localhost`, `Glasses`) connected by labeled arrows (`PreToolUse hook · unix socket`, `WebSocket · LAN`); below, three explainer cards (grid like `.su-steps`): *Hook escalation* (every tool call hits the relay; it passes through or blocks until you answer), *Live transcript* (each session's conversation streams to the glasses over WebSocket), *QR pairing* (the relay dashboard shows a QR carrying host + port + a channel token — scan once, you're paired).
3. **Demo slot** (`#demo`) — a fixed-aspect placeholder band (16:9 panel, dashed border, mono caption `demo video — coming soon`) sized so a `<video>` drops in without layout change.
4. **Security model** (`#security`) — four short cards: credential stays on host; glasses hold only host+port+token; fail-open by construction (unanswered → Claude's own prompt, never silent bypass); regenerate token to revoke a leaked QR.
5. **Install** (`#install`) — two columns: **Glasses app** (APK download button, `href="#"`, badge `coming soon`) and **Host relay** (code block:
   `npm install -g clairvoyant-relay`, `clairvoyant-relay install-hook`, `clairvoyant-relay start`, then "scan the QR from the dashboard"), badge `releases being prepared`; below, contact panel like `.su-contact`: mailto `srchig@iu.edu?subject=Clairvoyant%20early%20access`.

**Steps:**

- [ ] Create branch `clairvoyant-page`
- [ ] Write `assets/clairvoyant/clairvoyant.css` (scoped under `.clairvoyant`, reuse site custom properties, include `@media(max-width:760px)` collapse and `prefers-reduced-motion` guard, per sucor.css)
- [ ] Write `_pages/clairvoyant.html` with the five sections above
- [ ] Build: `bundle exec jekyll build` → expect success, `docs/clairvoyant/index.html` exists
- [ ] Visual check at desktop + mobile widths (browser screenshot)
- [ ] Commit `feat(clairvoyant): landing page at /clairvoyant/`

### Task 2: Announcement post

**Files:**
- Create: `_posts/2026-07-06-clairvoyant.md` (front matter like existing posts: `layout: post`, title `Clairvoyant: approving Claude Code from smart glasses`, author, description, categories `projects`, tags `claude-code smart-glasses android`)

**Content (first person, ~400–600 words):** the itch (long-running agent sessions block on permission prompts while you're away from the desk); the dead end (plan A was QR-ing the claude.ai session onto the glasses — impossible, `sessionKey` is an httpOnly cookie no page JS can read); the architecture that worked (a local relay that attaches to sessions you already run: PreToolUse hook over a unix socket for approvals, transcript JSONL tailing streamed over WebSocket for monitoring, QR pairing with a self-minted channel token); the security framing (credential never leaves the host; fail-open); close linking to `/clairvoyant/` for the showcase + install.

**Steps:**

- [ ] Write the post
- [ ] Build: `bundle exec jekyll build` → post appears under `docs/` and in `feed.xml`
- [ ] Commit `feat(clairvoyant): announcement post`

### Task 3: Projects index entry

**Files:**
- Modify: `_pages/projects.md` — add a `work-row` (`W.01`-style numbering: insert as new top entry and renumber, or append; match existing markup exactly) linking `/clairvoyant/`, title `Clairvoyant — Claude Code on smart glasses`, tags `Android`, `Node/TS`, `Claude Code`; update the `N Entries` meta count.

**Steps:**

- [ ] Add the row, bump the count
- [ ] Build + check `/projects/` renders with the new row
- [ ] Commit `feat(clairvoyant): projects index entry`

### Task 4: Full verification

- [ ] `bundle exec jekyll build` clean
- [ ] Serve locally and click through: `/clairvoyant/` anchors, post → page link, projects row → page
- [ ] Screenshot desktop + mobile for review
