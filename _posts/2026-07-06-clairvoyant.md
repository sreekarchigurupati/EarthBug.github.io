---
layout: post
title: "Clairvoyant: approving Claude Code from smart glasses"
author: "Sreekar Chigurupati"
description: "Why I built a local relay that streams my Claude Code sessions to smart glasses — and why the obvious approach was impossible."
categories: projects
tags: claude-code smart-glasses android agents
---

> TL;DR: Clairvoyant streams your running Claude Code sessions to smart glasses and lets you approve or deny tool permissions with a glance. Your Claude credential never leaves your machine. Showcase and install details live at [/clairvoyant/](/clairvoyant/).

## The itch

Agentic coding has a rhythm problem. You kick off a Claude Code session, it works happily for four minutes, and then it stops — *may I run `git push`?* — and waits. If you're at the desk, fine. If you've wandered off to make coffee, the session sits blocked until you come back, and the twenty minutes of autonomy you were promised turns into a series of round trips to the keyboard.

I have a pair of camera-equipped Android smart glasses. The obvious fix: put the permission prompt on my face.

## The dead end

Plan A was to get the glasses talking to claude.ai directly — transfer my existing session onto the device by encoding the credential into a QR code, scan it, done.

That plan is impossible by design. The claude.ai session credential is an httpOnly cookie (`sessionKey`). It's invisible in the UI, unreadable by page JavaScript, and unreachable cross-origin — so no website, and no non-Android device, can read your existing session and turn it into a QR. There is no "token to show." That's the right call security-wise, and it killed the direct approach cleanly.

## The relay

The architecture that worked flips the problem: don't move the credential to the glasses — keep it on the host and give the glasses a narrow window into the sessions you already run.

A small relay runs on my machine, and it attaches to normal terminal Claude Code sessions through two seams:

- **Approvals** ride a [PreToolUse hook](https://docs.claude.com/en/docs/claude-code/hooks). Installed in Claude's `settings.json`, the hook calls the relay over a local Unix socket on every tool call. The relay either passes through to Claude's own permission flow or escalates to the glasses and blocks until I answer — allow or deny, from anywhere on the LAN.
- **Monitoring** comes from tailing each session's transcript JSONL and streaming it to the glasses over a WebSocket, so I can watch what the agent is doing, not just gate it.

Pairing is a QR on the relay's dashboard carrying exactly three things: host, port, and a channel token the relay mints itself. The glasses authenticate to the *relay*, never to Claude. And the failure mode is deliberately boring: anything not explicitly answered on the glasses falls back to Claude's own prompt in the terminal — the relay can't silently approve anything, and an absent device never blocks your terminal.

## Where it stands

The relay (Node/TypeScript) and the Android glasses app both work today on my LAN; releases — an APK and an npm package for the relay — are being prepared. The showcase page has the architecture, the security model, and the install flow: **[sreekar.ch/clairvoyant](/clairvoyant/)**. If you have compatible glasses and want an early build, [email me](mailto:srchig@iu.edu?subject=Clairvoyant%20early%20access).
