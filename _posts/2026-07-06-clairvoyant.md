---
layout: post
title: "Clairvoyant: approving Claude Code from smart glasses"
author: "Sreekar Chigurupati"
description: "Why I built a local relay that streams my Claude Code sessions to smart glasses — and why the obvious approach was impossible."
categories: projects
tags: claude-code smart-glasses android agents
---

> TL;DR: Clairvoyant streams your running Claude Code sessions to smart glasses and lets you approve or deny tool permissions with a glance. Your Claude credential never leaves your machine. Out now — `npm i -g clairvoyant-relay` and the [glasses APK](https://github.com/sreekarchigurupati/clairvoyant/releases/latest); showcase and install details at [/clairvoyant/](/clairvoyant/).

## The itch

Agentic coding has a rhythm problem. You kick off a Claude Code session, it works happily for four minutes, and then it stops — *may I run `git push`?* — and waits. If you're at the desk, fine. If you've wandered off to make coffee, the session sits blocked until you come back, and the twenty minutes of autonomy you were promised turns into a series of round trips to the keyboard.

I have a pair of camera-equipped Android smart glasses. The obvious fix: put the permission prompt on my face.

## The dead end

Plan A was to get the glasses talking to claude.ai directly — transfer my existing session onto the device by encoding the credential into a QR code, scan it, done.

That plan is impossible by design. The claude.ai session credential is an httpOnly cookie (`sessionKey`). It's invisible in the UI, unreadable by page JavaScript, and unreachable cross-origin — so no website, and no non-Android device, can read your existing session and turn it into a QR. There is no "token to show." That's the right call security-wise, and it killed the direct approach cleanly.

## The relay

The architecture that worked flips the problem: don't move the credential to the glasses — keep it on the host and give the glasses a narrow window into the sessions you already run.

A small relay runs on my machine, and it attaches to normal terminal Claude Code sessions through two seams:

- **Approvals** ride a [PermissionRequest hook](https://docs.claude.com/en/docs/claude-code/hooks). Installed in Claude's `settings.json`, it fires only when Claude Code has *already decided to show a permission dialog*, and its answer resolves that exact dialog. The hook calls the relay over a local Unix socket; the relay mirrors the prompt to the glasses and blocks until I answer — allow or deny, from anywhere on the LAN.
- **Monitoring** comes from a PreToolUse hook that only tracks sessions (never answers permissions), plus tailing each session's transcript JSONL and streaming it to the glasses over a WebSocket — so I can watch what the agent is doing, not just gate it.

Pairing is a QR on the relay's dashboard carrying exactly three things: host, port, and a channel token the relay mints itself. The glasses authenticate to the *relay*, never to Claude. And the failure mode is deliberately boring: anything not explicitly answered on the glasses falls back to Claude's own prompt in the terminal — the relay can't silently approve anything, and an absent device never blocks your terminal.

## Prompt parity, the hard way

The first version hung the approvals off a PreToolUse hook — the only seam I knew about. PreToolUse fires on *every* tool call, before Claude runs its own permission evaluation, so the relay had to guess whether Claude was going to prompt: reimplement the permission-mode table, parse `settings.json` allow rules, keep a list of read-only tools. The guesses were conservative and still wrong in both directions — the glasses would ask for commands Claude had auto-approved, and an approval on the glasses could race Claude's own flow and leave the terminal asking again.

The fix was discovering that a seam now exists exactly where I needed it: the `PermissionRequest` hook event fires *after* Claude's permission evaluation, only when a dialog is genuinely about to appear, and its JSON reply answers that dialog. The whole heuristic layer — mode tables, rule parsing — got deleted the same hour. The glasses now prompt if and only if the terminal would have.

That same hook payload turned out to carry the rules Claude would add if you picked "don't ask again," and its reply can persist them. So the glasses grew a third answer: a touchpad *long-press* means "always allow" — approve this call and remember the rule — shown only when Claude actually offers it for that prompt. Tap to allow once, long-press to allow forever, temple button to deny.

## The tap that took photos

The glasses-side lesson was stranger. On Rokid's Android glasses, tap-to-approve did nothing — and took a *photo* instead. The official docs say a touchpad tap reaches apps as an ENTER key event. On my firmware it doesn't: the tap arrives as keycode 184, which the system consumes (never delivering a key event to the app) and re-emits as a protected ordered broadcast, `ACTION_BOLON_TAP`, whose default handler is the system camera. I found this by pulling `services.jar` off the device and decompiling the input policy.

So the app now claims the tap the same way the system camera would have received it: a broadcast receiver at priority 100 that answers the visible prompt and calls `abortBroadcast()`, so the photo handler never runs. Two smaller traps followed: the ENTER key event that *does* exist arrives with only its UP half (the system eats the DOWN while deciding whether you're long-pressing for the AI assistant), and key events route to whatever view has focus first — my first "working" build was helpfully clicking the session tab title. Input handling on head-worn Android is archaeology, not API reading.

## Where it stands

It's out. **v0.1.0** is the first release: the relay is on npm and the signed glasses APK is a GitHub release asset.

```sh
# on your machine
npm install -g clairvoyant-relay
clairvoyant-relay install-hook   # adds the PermissionRequest + PreToolUse hooks
clairvoyant-relay start          # prints a dashboard URL with the pairing QR
```

Then sideload the [APK](https://github.com/sreekarchigurupati/clairvoyant/releases/latest) on camera-equipped Android smart glasses and scan the QR. The [showcase page](/clairvoyant/) has the architecture, the security model, and the full install flow; the code is on [GitHub](https://github.com/sreekarchigurupati/clairvoyant). Both halves are open source (MIT). Found a bug or have glasses I haven't tested? [Email me](mailto:srchig@iu.edu?subject=Clairvoyant).
