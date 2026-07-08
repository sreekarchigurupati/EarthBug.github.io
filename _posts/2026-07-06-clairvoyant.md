---
layout: post
title: "Clairvoyant: approving Claude Code from smart glasses"
author: "Sreekar Chigurupati"
description: "Why I built a local relay that streams my Claude Code sessions to smart glasses — and why the obvious approach was impossible."
categories: projects
tags: claude-code smart-glasses android agents
---

> TL;DR: Clairvoyant streams your running Claude Code sessions to smart glasses and lets you approve or deny tool permissions with a glance. Your Claude credential never leaves your machine — and with one flag it works away from home too, over a Tailscale Funnel. Out now — `npm i -g clairvoyant-relay` and the [glasses APK](https://github.com/sreekarchigurupati/clairvoyant/releases/latest); showcase and install details at [/clairvoyant/](/clairvoyant/).

<figure style="margin:2em auto; max-width:380px; text-align:center">
  <video autoplay muted loop playsinline preload="metadata"
    poster="/assets/clairvoyant/demo-poster.jpg"
    style="width:100%; border-radius:12px; display:block"
    aria-label="Demo recorded through the glasses: a live Claude Code session streams onto the lens and a Bash permission prompt is approved with a tap.">
    <source src="/assets/clairvoyant/demo.mp4" type="video/mp4">
  </video>
  <figcaption style="font-size:.85em; opacity:.7; margin-top:.6em">Recorded through the lens at 4× speed — approving a session mid-Hanon. Hands never leave the (piano) keyboard.</figcaption>
</figure>

## The itch

Agentic coding has a rhythm problem. You kick off a Claude Code session, it works happily for four minutes, and then it stops — *may I run `git push`?* — and waits until you walk back to the keyboard. I have a pair of camera-equipped Android smart glasses, so the fix suggested itself: put the permission prompt on my face.

## The dead end

Plan A — encode my claude.ai session into a QR and move it onto the glasses — is impossible by design. The session credential is an httpOnly cookie: invisible to the UI, unreadable by page JavaScript, unreachable cross-origin. There is no "token to show." That's the right call security-wise, and it killed the direct approach cleanly.

## The relay

So the architecture flips: the credential stays on the host, and the glasses get a narrow window into the sessions you already run. A small relay on my machine attaches to normal terminal Claude Code sessions through two seams: a [PermissionRequest hook](https://docs.claude.com/en/docs/claude-code/hooks) that fires only when Claude Code has *already decided to show a permission dialog* — the relay mirrors it to the glasses, and the answer resolves that exact dialog — and a transcript tail streamed over WebSocket so I can watch what the agent is doing, not just gate it.

Pairing is a QR on the relay's dashboard carrying host, port, and a channel token the relay mints itself. The glasses authenticate to the *relay*, never to Claude. And the failure mode is deliberately boring: anything not answered on the glasses falls back to Claude's own terminal prompt — the relay can't silently approve, and an absent device never blocks your terminal.

## Prompt parity, the hard way

The first version used a PreToolUse hook, which fires on *every* tool call — before Claude decides whether to prompt — so the relay had to guess: reimplement the permission-mode table, parse settings allow-rules, and still be wrong in both directions. The fix was the `PermissionRequest` hook event, which fires exactly when a dialog is about to appear. The whole heuristic layer got deleted the same hour; the glasses now prompt if and only if the terminal would have.

The same hook payload carries the rules Claude would add for "don't ask again," so the glasses grew a third answer: tap to allow once, *long-press* to allow forever, temple button to deny.

## The tap that took photos

On Rokid's glasses, tap-to-approve initially did nothing — and took a *photo* instead. The docs say a tap reaches apps as an ENTER key; on my firmware it arrives as keycode 184, which the system consumes and re-emits as an ordered broadcast whose default handler is the camera. (I learned this by decompiling `services.jar` off the device.) The app now claims that broadcast at higher priority and aborts it, so the prompt gets answered and the photo never happens. Input handling on head-worn Android is archaeology, not API reading.

## Leaving the house

The LAN version stopped at the edge of my Wi-Fi, and the obvious remedy doesn't work: **hotspot tethering bypasses the phone's VPN** on both Android and iOS, so glasses on your phone's hotspot can never reach a tailnet IP through it.

Instead, `clairvoyant-relay start --funnel` publishes exactly one path — the WebSocket endpoint — through [Tailscale Funnel](https://tailscale.com/kb/1223/funnel), public but gated by the same 192-bit channel token. The dashboard, whose QR embeds that token, never leaves the LAN. The pairing QR carries both addresses, and the glasses dial LAN-first (three-second timeout) with the funnel as fallback on every reconnect — walk out mid-session and the connection follows you; come home and it drifts back to the direct path. No toggle, no settings screen. If you tunnel some other way, `--advertise-url` puts any ngrok/cloudflared address in the QR instead.

## Where it stands

The current release is **v0.2.0**: the relay on npm, the signed glasses APK on GitHub.

```sh
# on your machine
npm install -g clairvoyant-relay
clairvoyant-relay install-hook   # adds the PermissionRequest + PreToolUse hooks
clairvoyant-relay start          # prints a dashboard URL with the pairing QR
# or, to use the glasses away from home (needs Tailscale on this machine):
clairvoyant-relay start --funnel
```

Then sideload the [APK](https://github.com/sreekarchigurupati/clairvoyant/releases/latest) on camera-equipped Android smart glasses and scan the QR. The [showcase page](/clairvoyant/) has the architecture, security model, and full install flow; the code is on [GitHub](https://github.com/sreekarchigurupati/clairvoyant), MIT-licensed. Found a bug or have glasses I haven't tested? [Email me](mailto:srchig@iu.edu?subject=Clairvoyant).
