# Clairvoyant showcase on sreekar.ch — Design

**Date:** 2026-07-06
**Status:** Approved
**Repo:** EarthBug.github.io (Jekyll, builds to `docs/`, served at sreekar.ch)

## Goal

Showcase the Clairvoyant project (smart-glasses monitor/approve surface for Claude Code)
on the personal site, with an install section stubbed until real artifacts (APK GitHub
Release, `clairvoyant-relay` npm package) are published. The clairvoyant repo is private
today; nothing on the page may depend on it being public.

## What Clairvoyant is (source of truth for copy)

- Android app running on camera-equipped smart glasses + a local Node/TypeScript relay
  on the host machine (`clairvoyant` repo: `app/` + `relay/`).
- The relay attaches to Claude Code sessions the user already runs in their terminals:
  - A **PreToolUse hook** in Claude's `settings.json` calls the relay over a Unix socket
    on every tool call; the relay either passes through or escalates to the glasses and
    blocks until answered (`allow`/`deny`).
  - A **WebSocket** streams each session's transcript to the glasses and carries
    approve/deny; an HTTP dashboard shows a pairing QR.
- Security model: the Claude credential never leaves the host. Glasses get only
  `host + port + channel token` via the QR, LAN-only, token regenerable. Until a client
  pairs, the hook fails open to the terminal prompt.

## Deliverables

### 1. Landing page `/clairvoyant/`

- `_pages/clairvoyant.html` (layout: default, permalink `/clairvoyant/`) +
  `assets/clairvoyant/clairvoyant.css`. Follow the SuCor page's conventions
  (`.reveal` scroll animation, band/section structure, kicker/heading pattern) but with
  its own visual identity.
- Sections:
  1. **Hero** — kicker "Claude Code on your glasses", headline, one-paragraph lede,
     meta chips (Android · smart glasses · local relay · LAN-only), CTAs: "Install ↓"
     (anchor) and "How it works ↓".
  2. **How it works** — pure-CSS/SVG architecture diagram (terminal → relay → glasses)
     plus three explainer cards: PreToolUse hook escalation, transcript streaming over
     WebSocket, QR pairing with a channel token.
  3. **Demo slot** — styled placeholder band ("demo video coming soon") sized so a real
     video/GIF drops in later without layout changes.
  4. **Security model** — credential stays on host; glasses only get host+port+token;
     fail-open by construction; regenerate token to revoke.
  5. **Install** — written as the real flow, each step carrying a small
     "coming soon — releases being prepared" badge:
     - APK download button (placeholder `href="#"` + badge).
     - Relay setup as shell steps (npm-style install, `install-hook`, `start`).
     - Mailto fallback CTA for early access (srchig@iu.edu), mirroring SuCor.
     When artifacts ship, only the badges and URLs change.

### 2. Announcement post

- `_posts/2026-07-06-clairvoyant.md`. Short, personal write-up: the problem (walking
  away from running agent sessions), the dead end (transferring the claude.ai session
  via QR is impossible — httpOnly cookie), the relay architecture that worked
  (hook escalation + transcript tailing), link to `/clairvoyant/`.

### 3. Projects index entry

- Add a `work-row` for Clairvoyant in `_pages/projects.md` linking to `/clairvoyant/`,
  with tags (Android · Node/TS · Claude Code), and bump the entry count in the meta line.

## Out of scope

Publishing the APK / npm package, making the clairvoyant repo public, capturing
screenshots or video, any change to the clairvoyant repo itself.

## Error handling / constraints

- Page must render acceptably with JS disabled (reveal animation degrades to visible).
- No external assets (fonts/CDNs) beyond what the site already uses.
- `_specs/` and other underscore dirs are ignored by Jekyll; nothing here may be written
  into `docs/` (that is the build output GitHub Pages serves).

## Testing

Build the site locally (`bundle exec jekyll build` or the repo's Rakefile task) and
verify `/clairvoyant/` renders, the post appears in the feed, anchors work, and the
projects index row links correctly. Visual check in a browser at mobile + desktop widths.
